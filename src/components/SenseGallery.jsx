import { useEffect, useRef, useState } from 'react'
import { senses } from '../data/senses'
import TopNav from './TopNav'
import Marquee from './Marquee'
import FooterNav from './FooterNav'
import travelDevelopment from '../assets/images/senses-animation-image/dvelopment1.png'
import travelDesign from '../assets/images/senses-animation-image/design2.png'
import travelConstruction from '../assets/images/senses-animation-image/construction3.png'
import travelOperations from '../assets/images/senses-animation-image/opetration4.png'
import travelPractice from '../assets/images/senses-animation-image/practice5.png'
import travelFullLogo from '../assets/images/senses-animation-image/last-full-image.png'

// One frame per sense, in the same order as `senses` (earth/development,
// air/design, fire/construction, water/operations, ether/practice), plus a
// final full-logo frame shown centered over the whole grid before looping
// back to the start.
const travelFrames = [travelDevelopment, travelDesign, travelConstruction, travelOperations, travelPractice]

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

  // One shared icon travels tile-to-tile (development → design →
  // construction → operations → practice), then a final step centers the
  // full logo over the whole grid and the animation stops there — it does
  // not loop. Steps 0-4 map to senses[step]; step 5 is the finale/end state.
  const [travelStep, setTravelStep] = useState(0)
  const [travelPos, setTravelPos] = useState(null) // { left, top } in px, relative to gridRef

  // fresh run each time the gallery opens
  useEffect(() => {
    if (open) setTravelStep(0)
  }, [open])

  useEffect(() => {
    if (!open || expanding || travelStep >= senses.length) return
    const id = setInterval(() => {
      setTravelStep((s) => (s >= senses.length ? s : s + 1))
    }, 2600)
    return () => clearInterval(id)
  }, [open, expanding, travelStep])

  useEffect(() => {
    if (!open) return
    const measure = () => {
      const gridEl = gridRef.current
      if (!gridEl) return
      const gridBox = gridEl.getBoundingClientRect()
      if (travelStep < senses.length) {
        const tileEl = btnRefs.current[senses[travelStep].key]
        if (!tileEl) return
        const box = tileEl.getBoundingClientRect()
        setTravelPos({
          left: box.left - gridBox.left + box.width / 2,
          top: box.top - gridBox.top + box.height / 2,
        })
      } else {
        setTravelPos({ left: gridBox.width / 2, top: gridBox.height / 2 })
      }
    }
    // rAF so layout (e.g. right after the gallery opens) has settled first
    const id = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', measure)
    }
  }, [open, travelStep])

  useEffect(() => {
    // leaving the gallery (footer nav pick, close, back-to-detail, etc.) —
    // clear any expanded photo so coming back always lands on the grid,
    // not wherever it was left expanded.
    if (!open) setExpanding(null)
  }, [open])

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

  const handleCollapse = () => {
    setExpanding((e) => (e ? { ...e, active: false, closing: true } : e))
  }

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
              className={`animate-panel-in relative flex flex-col overflow-hidden border-r border-white/10 text-left last:border-r-0 transition-opacity duration-200 ${
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
              </div>
            </button>
          )
        })}

        {/* the one shared traveling icon — see the travelStep effects above.
            Positioned in px relative to the grid, so it can move smoothly
            between tiles that don't share a common CSS position. */}
        {travelPos && !expanding && (
          <div
            className="pointer-events-none absolute z-10 flex items-center justify-center transition-[left,top] duration-[1400ms] ease-in-out"
            style={{ left: travelPos.left, top: travelPos.top, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative flex h-[180px] w-[180px] items-center justify-center sm:h-[220px] sm:w-[220px]">
              <img
                key={travelStep}
                src={travelStep === senses.length ? travelFullLogo : travelFrames[travelStep]}
                alt=""
                className={`relative w-full drop-shadow-[0_0_30px_rgba(0,0,0,0.6)] ${
                  travelStep === senses.length ? '' : 'animate-spin-once'
                }`}
                style={travelStep === senses.length ? undefined : { animationDuration: '5s' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* real footer menu, same as the home page — was missing before, so
          the space below the grid/expanded photo just looked empty */}
      <FooterNav activeKey={expanding?.key ?? activeKey} onSelect={(key) => onSelect?.(key)} />

      {expanding && (
        <div
          className="fixed z-[60] flex flex-col overflow-hidden"
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
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '250ms' : '0ms' }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${expanding.sense.bg})` }}
            />
            <div className="absolute inset-0" style={{ background: '#00000099' }} />
          </div>

          {/* back button — same as SenseDetail: desktop/tablet only */}
          <button
            type="button"
            onClick={handleCollapse}
            aria-label="Back to overview"
            className="absolute left-5 top-5 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-opacity duration-300 hover:bg-white/20 sm:flex"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '250ms' : '0ms' }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* right description — same as SenseDetail: desktop/tablet only */}
          <div
            className="pointer-events-none absolute right-6 top-1/2 hidden max-w-[280px] -translate-y-1/2 text-right font-roboto text-[13px] leading-relaxed text-white/70 transition-opacity duration-300 sm:block sm:right-14"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '250ms' : '0ms' }}
          >
            {expanding.sense.description}
          </div>

          {/* same center layout as SenseDetail: side text on sm+, stacked
              title/description below the mark on mobile */}
          <div
            className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 transition-opacity duration-300 sm:flex-row sm:justify-center sm:gap-0"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '250ms' : '0ms' }}
          >
            {/* left label — desktop/tablet only */}
            <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 text-left sm:block sm:left-14 md:left-24">
              <p className="font-roboto text-xs font-normal leading-[16px] text-white">
                {expanding.sense.element}
              </p>
              <h1
                className="mt-[15px] font-heading text-[clamp(20px,1.8vw,34px)] font-semibold leading-tight tracking-[-0.32px]"
                style={{ color: expanding.sense.accent }}
              >
                {expanding.sense.title}
              </h1>
              <p className="mt-[15px] font-roboto text-[10px] font-normal uppercase tracking-[0.2em] text-white">
                Intelligence / {expanding.sense.element} · {expanding.sense.sense}
              </p>
            </div>

            {/* accent ring + recolored mark */}
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

            {/* title + description — mobile only, shown below the mark */}
            <div className="flex max-w-xs flex-col items-center gap-3 text-center sm:hidden">
              <p className="font-roboto text-[11px] font-normal uppercase tracking-[0.2em] text-white">
                {expanding.sense.element} · {expanding.sense.sense}
              </p>
              <h1
                className="font-heading text-2xl font-semibold leading-tight tracking-[-0.32px]"
                style={{ color: expanding.sense.accent }}
              >
                {expanding.sense.title}
              </h1>
              <p className="font-roboto text-sm leading-relaxed text-white/70">
                {expanding.sense.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
