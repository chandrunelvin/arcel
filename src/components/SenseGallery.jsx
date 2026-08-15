import { useEffect, useRef, useState } from 'react'
import TopNav from './TopNav'
import Marquee from './Marquee'
import FooterNav from './FooterNav'
import lastLogoFirst from '../assets/images/senses-animation-image/last-logo-first.svg'
import rotatLogoSecond from '../assets/images/senses-animation-image/rotat-logo-secend.svg'
import intelligenceBg from '../assets/images/senses/intelligence-image-bg.webp'

function SenseSubtitle({ element, sense, accent, className = '', copy }) {
  return (
    <p className={className}>
      <span className="text-white">{copy.intelligencePrefix}</span>
      <span style={{ color: accent }}>{element.toUpperCase()}</span>
      <span className="text-white">{copy.subtitleJoiner}{sense}</span>
    </p>
  )
}

// Full-screen expanded view opened from the footer nav. Each column shows
// that sense's own background photo (senses.js `bg`) and its own center
// artwork, tinted with that sense's accent. The real FooterNav menu sits
// below the grid once, shared by every column.
//
// `hideTiles` (mobile): same overlay shell and smooth fade-in, same
// centered "arcel Intelligence" lockup, but without the sense tile grid —
// mobile doesn't get a browsable gallery, just this page as the auto-
// rotation's landing point.
export default function SenseGallery({
  open,
  onClose,
  onSelect,
  hideTiles = false,
  senses,
  copy,
  language,
  onLanguageChange,
}) {
  const btnRefs = useRef({})
  const gridRef = useRef(null)
  // FLIP-style transition: the clicked column's own photo grows from its
  // grid rect to fill just the content area between the header (TopNav +
  // marquee) and the footer, then hands off to SenseDetail (which shows
  // that same photo full-bleed in that same area), so the swap reads as
  // one continuous slide instead of a cut — header and footer never move.
  const [expanding, setExpanding] = useState(null) // { key, sense, rect, targetRect, active, closing }

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

  const handleFooterPick = (key) => {
    const sense = senses.find((item) => item.key === key)
    if (!sense) return
    if (hideTiles) {
      onSelect?.(key)
      return
    }
    if (expanding) {
      setExpanding((current) =>
        current
          ? {
              ...current,
              key: sense.key,
              sense,
              active: true,
              closing: false,
            }
          : current
      )
      return
    }
    handlePick(sense)
  }

  if (!open && !expanding) return null

  return (
    <div className="animate-overlay-fade fixed inset-0 z-50 flex flex-col bg-black">
      {/* relative + z-index above the sliding clone below, so the header
          never gets covered even for a stray pixel while it's animating */}
      <div className="relative z-[70]">
        <TopNav language={language} copy={copy} onLanguageChange={onLanguageChange} />
        <div className="flex items-center px-6 py-3 sm:px-10" style={{ background: '#191BDF' }}>
          <Marquee />
        </div>
      </div>

      <div
        ref={gridRef}
        className={`relative grid flex-1 ${hideTiles ? 'grid-cols-1 bg-black' : 'grid-cols-2 sm:grid-cols-5'} ${expanding ? 'pointer-events-none' : ''}`}
      >
        {/* mobile-only backdrop, same photo as the home finale beat */}
        {hideTiles && (
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${intelligenceBg})` }}
            />
            <div className="absolute inset-0" style={{ background: '#00000099' }} />
          </div>
        )}

        {!hideTiles &&
          senses.map((sense, i) => {
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

        {/* single centered "arcel Intelligence" lockup over the whole grid
            — wordmark and mark side by side as one image, only the mark
            half spins */}
        {!expanding && (
          <div className="animate-panel-in pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 overflow-hidden sm:gap-[1.2%]">
            {/* mobile (hideTiles, single column) keeps its fixed size;
                desktop (5-tile grid, sm+) is sized off viewport width
                instead (each tile is ~20vw) so the lockup scales
                continuously and always stays centered and inside the
                middle tile instead of overflowing at in-between desktop
                widths like the old fixed sm:/lg: breakpoints did */}
            <img
              src={lastLogoFirst}
              alt=""
              className="w-[104px] drop-shadow-[0_0_30px_rgba(0,0,0,0.6)] sm:w-[clamp(72px,10vw,170px)]"
            />
            <img
              src={rotatLogoSecond}
              alt=""
              className="animate-spin-slow w-[56px] drop-shadow-[0_0_30px_rgba(0,0,0,0.6)] sm:w-[clamp(36px,5vw,85px)]"
            />
          </div>
        )}
      </div>

      {/* real footer menu, same as the home page — was missing before, so
          the space below the grid/expanded photo just looked empty. No tab
          is active while sitting on the overview grid — only once a tile
          is picked and expanded does its tab light up. */}
      <FooterNav activeKey={expanding?.key ?? null} onSelect={handleFooterPick} senses={senses} copy={copy} />

      {expanding && (
        <div
          className="fixed z-[60] flex flex-col overflow-hidden"
          style={{
            top: expanding.active ? expanding.targetRect.top : expanding.rect.top,
            left: expanding.active ? expanding.targetRect.left : expanding.rect.left,
            width: expanding.active ? expanding.targetRect.width : expanding.rect.width,
            height: expanding.active ? expanding.targetRect.height : expanding.rect.height,
            transition:
              'top 760ms cubic-bezier(.16,1,.3,1), left 760ms cubic-bezier(.16,1,.3,1), width 760ms cubic-bezier(.16,1,.3,1), height 760ms cubic-bezier(.16,1,.3,1), transform 760ms cubic-bezier(.16,1,.3,1), opacity 520ms ease-out',
            transform: expanding.active ? 'scale(1)' : 'scale(0.985)',
            opacity: expanding.active ? 1 : 0.92,
            transformOrigin: 'center center',
            willChange: 'top, left, width, height, transform, opacity',
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName !== 'width') return
            // only clear on the way back down (closed) — once fully grown
            // it just sits there as the "opened" state, no page swap.
            if (expanding.closing) setExpanding(null)
          }}
        >
          {/* photo is visible immediately (not fade-delayed) so it grows
              in step with the box itself. All senses stay stacked and
              crossfade via opacity + a gentle scale settle, so switching
              senses while already expanded (via the footer nav) blends
              smoothly instead of hard-cutting straight to the new photo. */}
          {senses.map((s) => (
            <div
              key={s.key}
              className="absolute inset-0 bg-cover bg-center transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                backgroundImage: `url(${s.bg})`,
                opacity: s.key === expanding.key ? 1 : 0,
                transform: s.key === expanding.key ? 'scale(1)' : 'scale(1.06)',
              }}
            />
          ))}
          <div className="absolute inset-0" style={{ background: '#00000099' }} />

          {/* back button — same as SenseDetail: desktop/tablet only */}
          <button
            type="button"
            onClick={handleCollapse}
            aria-label={copy.backToOverview}
            className="absolute left-5 top-5 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-opacity duration-500 hover:bg-white/20 sm:flex"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '460ms' : '0ms' }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* right description — same as SenseDetail: desktop/tablet only */}
          <div
            className="pointer-events-none absolute right-6 top-1/2 hidden max-w-[360px] -translate-y-1/2 text-right font-roboto text-base leading-7 text-white/92 transition-opacity duration-500 sm:block sm:right-14"
            style={{ opacity: expanding.active ? 1 : 0, transitionDelay: expanding.active ? '460ms' : '0ms' }}
          >
            {expanding.sense.description}
          </div>

          {/* same center layout as SenseDetail: side text on sm+, stacked
              title/description below the mark on mobile */}
          <div
            key={expanding.key}
            className="relative flex flex-1 flex-col items-center justify-center gap-3 px-6 py-4 transition-[opacity,transform] duration-700 sm:flex-row sm:justify-center sm:gap-0 sm:py-0"
            style={{
              opacity: expanding.active ? 1 : 0,
              transform: expanding.active ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: expanding.active ? '460ms' : '0ms',
            }}
          >
            {/* left label — desktop/tablet only */}
            <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 text-left sm:block sm:left-14 md:left-24">
              <h1
                className="font-heading text-2xl font-semibold leading-tight tracking-[-0.32px] text-white sm:text-3xl"
              >
                {expanding.sense.title}
              </h1>
              <SenseSubtitle
                element={expanding.sense.element}
                sense={expanding.sense.sense}
                accent={expanding.sense.accent}
                copy={copy}
                className="mt-[15px] font-roboto text-xs font-normal leading-[16px] uppercase tracking-[0.2em]"
              />
            </div>

            {/* accent ring + recolored mark */}
            <div className="relative flex h-[clamp(180px,34vh,280px)] w-[clamp(180px,34vh,280px)] shrink-0 items-center justify-center sm:h-[380px] sm:w-[380px]">
              <img
                key={`mark-${expanding.key}`}
                src={expanding.sense.centerImage}
                alt={`${expanding.sense.element} — ${expanding.sense.title}`}
                className={expanding.active ? 'animate-spin-once-slow relative w-[65%]' : 'relative w-[65%]'}
              />
            </div>

            {/* title + description — mobile only, shown below the mark */}
            <div className="flex max-w-[17rem] flex-col items-center gap-2 text-center sm:hidden">
              <h1
                className="font-heading text-[1.35rem] font-semibold leading-tight tracking-[-0.32px] text-white"
              >
                {expanding.sense.title}
              </h1>
              <SenseSubtitle
                element={expanding.sense.element}
                sense={expanding.sense.sense}
                accent={expanding.sense.accent}
                copy={copy}
                className="font-roboto text-[11px] font-normal uppercase tracking-[0.18em]"
              />
              <p className="font-roboto text-[12px] leading-5 text-white/88">
                {expanding.sense.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
