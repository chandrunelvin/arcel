import { useEffect, useRef, useState } from 'react'
import { senses } from '../data/senses'
import TopNav from './TopNav'
import Marquee from './Marquee'
import FooterNav from './FooterNav'

// Full-screen expanded view opened from the footer nav. Each column shows
// that sense's own background photo (senses.js `bg`) and its own center
// artwork, tinted with that sense's accent. The real FooterNav menu sits
// below the grid once, shared by every column.
export default function SenseGallery({ open, onClose, onSelect, activeKey }) {
  const btnRefs = useRef({})
  const gridRef = useRef(null)
  // FLIP-style transition: the clicked column's own photo grows from its
  // grid rect to fill just the content area between the header (TopNav +
  // marquee) and the footer, then hands off to SenseDetail (which shows
  // that same photo full-bleed in that same area), so the swap reads as
  // one continuous slide instead of a cut — header and footer never move.
  const [expanding, setExpanding] = useState(null) // { key, sense, rect, targetRect, active, closing }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!expanding || expanding.active || expanding.closing) return
    // double rAF so the browser paints the starting rect before we flip
    // the target values — otherwise the transition gets skipped.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setExpanding((e) => (e ? { ...e, active: true } : e)))
    )
    return () => cancelAnimationFrame(id)
  }, [expanding])

  const handlePick = (sense) => {
    const el = btnRefs.current[sense.key]
    if (!el || !gridRef.current) {
      onSelect?.(sense.key)
      return
    }
    if (expanding) return
    const rect = el.getBoundingClientRect()
    // the footer nav below is a real flex sibling of the grid now, so the
    // grid's own rect already stops right above it — no manual subtraction
    // needed to keep the grown photo off the footer.
    const targetRect = gridRef.current.getBoundingClientRect()
    setExpanding({ key: sense.key, sense, rect, targetRect, active: false })
  }

  if (!open && !expanding) return null

  return (
    <div className="animate-overlay-fade fixed inset-0 z-50 flex flex-col bg-black">
      {/* relative + z-index above the sliding clone below, so the header
          never gets covered even for a stray pixel while it's animating */}
      <div className="relative z-[70]">
        <TopNav />
        <div className="flex items-center px-6 py-3 sm:px-10" style={{ background: '#191BDF' }}>
          <Marquee />
        </div>
      </div>

      <div
        ref={gridRef}
        className={`relative grid flex-1 grid-cols-2 sm:grid-cols-5 ${expanding ? 'pointer-events-none' : ''}`}
      >
        {senses.map((sense, i) => {
          return (
            <button
              key={sense.key}
              ref={(el) => (btnRefs.current[sense.key] = el)}
              type="button"
              onClick={() => handlePick(sense)}
              className={`animate-panel-in group relative flex flex-col overflow-hidden border-r border-white/10 text-left last:border-r-0 transition-opacity duration-200 ${
                expanding?.key === sense.key
                  ? 'invisible'
                  : expanding
                    ? 'opacity-0'
                    : ''
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* per-sense photo — swap the file in src/assets/images/senses/ to update */}
              <div className="relative flex-1 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${sense.bg})` }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: '#00000099' }}
                />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <img
                    src={sense.centerImage}
                    alt={`${sense.element} — ${sense.title}`}
                    className="w-full max-w-[180px] drop-shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105 sm:max-w-[220px]"
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* real footer menu, same as the home page — was missing before, so
          the space below the grid/expanded photo just looked empty */}
      <FooterNav activeKey={expanding?.key ?? activeKey} onSelect={(key) => onSelect?.(key)} />

      {expanding && (
        <div
          className="fixed z-[60] overflow-hidden"
          style={{
            top: expanding.active ? expanding.targetRect.top : expanding.rect.top,
            left: expanding.active ? expanding.targetRect.left : expanding.rect.left,
            width: expanding.active ? expanding.targetRect.width : expanding.rect.width,
            height: expanding.active ? expanding.targetRect.height : expanding.rect.height,
            transition:
              'top 420ms cubic-bezier(.4,0,.2,1), left 420ms cubic-bezier(.4,0,.2,1), width 420ms cubic-bezier(.4,0,.2,1), height 420ms cubic-bezier(.4,0,.2,1)',
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName !== 'width') return
            // only clear on the way back down (closed) — once fully grown
            // it just sits there as the "opened" state, no page swap.
            if (expanding.closing) setExpanding(null)
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${expanding.sense.bg})` }}
          />
          <div className="absolute inset-0" style={{ background: '#00000099' }} />

          {/* same accent ring + spinning center mark as SenseDetail */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '250ms' : '0ms' }}
          >
            <div className="relative flex h-[220px] w-[220px] shrink-0 items-center justify-center sm:h-[380px] sm:w-[380px]">
              {expanding.active && (
                <div
                  key={expanding.key}
                  className="animate-spin-once absolute inset-0 rounded-full border"
                  style={{ borderColor: expanding.sense.accent }}
                />
              )}
              <img
                key={expanding.key}
                src={expanding.sense.centerImage}
                alt={`${expanding.sense.element} — ${expanding.sense.title}`}
                className={expanding.active ? 'animate-spin-once relative w-[65%]' : 'relative w-[65%]'}
              />
              <p className="absolute bottom-2 font-roboto text-xs text-white/60 sm:bottom-4">
                {expanding.sense.element}
              </p>
            </div>
          </div>

          {/* same left label / right description as SenseDetail, faded in
              near the end of the grow so it reads as one continuous reveal
              instead of the text just appearing once the page swaps */}
          <div
            className="absolute left-6 top-1/2 -translate-y-24 text-left transition-opacity duration-300 sm:left-14 md:left-24"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '250ms' : '0ms' }}
          >
            <p className="font-roboto text-sm font-normal leading-[18px] text-white">
              {expanding.sense.element}
            </p>
            <h1
              className="mt-[15px] font-heading text-[clamp(28px,2.6vw,48px)] font-semibold leading-tight tracking-[-0.32px]"
              style={{ color: expanding.sense.accent }}
            >
              {expanding.sense.title}
            </h1>
            <p className="mt-[15px] font-roboto text-[11px] uppercase tracking-[0.2em] text-white/50">
              Intelligence / {expanding.sense.element} · {expanding.sense.sense}
            </p>
          </div>
          <div
            className="absolute right-6 top-1/2 max-w-[280px] -translate-y-1/2 text-right font-roboto text-[13px] leading-relaxed text-white/70 transition-opacity duration-300 sm:right-14"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '250ms' : '0ms' }}
          >
            {expanding.sense.description}
          </div>
        </div>
      )}
    </div>
  )
}
