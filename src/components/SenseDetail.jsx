import { useEffect, useRef } from 'react'
import FooterNav from './FooterNav'
import TopNav from './TopNav'
import Marquee from './Marquee'
import heroGridOverlay from '../assets/hero-grid-overlay.svg'

function SenseSubtitle({ element, sense, accent, className = '', copy }) {
  return (
    <p className={className}>
      <span className="text-white">{copy.intelligencePrefix}</span>
      <span style={{ color: accent }}>{element.toUpperCase()}</span>
      <span className="text-white">{copy.subtitleJoiner}{sense}</span>
    </p>
  )
}

// Single full-screen "detail" page for one sense — drilled into from the
// SenseGallery. Same hero composition as the homepage (photo + ringed mark +
// left heading / right description) but re-themed per sense, with the
// footer nav's active tab underlined in that sense's accent color.
export default function SenseDetail({
  open,
  activeKey,
  onSelect,
  onBack,
  onClose,
  senses,
  copy,
  language,
  onLanguageChange,
}) {
  const scrollRef = useRef(null)

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

  if (!open) return null

  const sense = senses.find((s) => s.key === activeKey) ?? senses[0]

  return (
    <div ref={scrollRef} className="animate-overlay-fade fixed inset-0 z-50 flex flex-col overflow-hidden bg-black">
      <TopNav language={language} copy={copy} onLanguageChange={onLanguageChange} />
      <div className="flex items-center px-6 py-3 sm:px-10" style={{ background: '#191BDF' }}>
        <Marquee />
      </div>

      <main key={sense.key} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* back to gallery / close to home */}
        <button
          type="button"
          onClick={onBack}
          aria-label={copy.backToOverview}
          className="absolute left-5 top-5 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:flex"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* per-sense photo — swap the file in src/assets/images/senses/ to update */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="animate-detail-bg-in absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${sense.bg})` }}
          />
          <div className="animate-detail-bg-in absolute inset-0" style={{ background: '#00000099' }} />
          <img
            src={heroGridOverlay}
            alt=""
            className="animate-detail-bg-in absolute inset-0 h-full w-full object-cover opacity-30"
          />
        </div>

        {/* right description */}
        <div className="animate-detail-content-in pointer-events-none absolute right-6 top-1/2 hidden max-w-[360px] -translate-y-1/2 text-right font-roboto text-base leading-7 text-white/92 sm:block sm:right-14">
          {sense.description}
        </div>

        {/* center content — stacked (ring, then title/description) on
            mobile since there's no room for the absolute side text there;
            anchored near the top (not vertically centered) so the extra
            height from `min-h-[100svh]` above doesn't read as a big empty
            gap above AND below the content — it collects below, right
            before the peek bar, which is where it's expected to be.
            Side-by-side + vertically centered with the absolute left/right
            text on sm+, unchanged. */}
        <div className="animate-detail-content-in relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-5 py-4 sm:flex-row sm:justify-center sm:gap-0 sm:px-6 sm:py-16">
          {/* left label — desktop/tablet only */}
          <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 text-left sm:block sm:left-14 md:left-24">
            <h1
              className="font-heading text-2xl font-semibold leading-tight tracking-[-0.32px] text-white sm:text-3xl"
            >
              {sense.title}
            </h1>
            <SenseSubtitle
              element={sense.element}
              sense={sense.sense}
              accent={sense.accent}
              copy={copy}
              className="mt-[15px] font-roboto text-xs font-normal leading-[16px] uppercase tracking-[0.2em]"
            />
          </div>

          {/* center mark */}
          <div className="relative flex h-[clamp(180px,34vh,280px)] w-[clamp(180px,34vh,280px)] shrink-0 items-center justify-center sm:h-[380px] sm:w-[380px]">
            <img
              key={`mark-${sense.key}`}
              src={sense.centerImage}
              alt={`${sense.element} — ${sense.title}`}
              className="animate-spin-once-slow relative w-[65%]"
            />
          </div>

          {/* title + description — mobile only, shown below the mark and
              above the footer nav */}
          <div className="flex max-w-[17rem] flex-col items-center gap-2 text-center sm:hidden">
            <h1
              className="font-heading text-[1.35rem] font-semibold leading-tight tracking-[-0.32px] text-white"
            >
              {sense.title}
            </h1>
            <SenseSubtitle
              element={sense.element}
              sense={sense.sense}
              accent={sense.accent}
              copy={copy}
              className="font-roboto text-[11px] font-normal uppercase tracking-[0.18em]"
            />
            <p className="font-roboto text-[12px] leading-5 text-white/88">
              {sense.description}
            </p>
          </div>
        </div>
      </main>

      {/* sticky at the bottom on mobile so it's always visible without
          scrolling; sits in normal flow on sm+ like before */}
      <div className="z-20">
        <FooterNav activeKey={sense.key} onSelect={onSelect} senses={senses} copy={copy} />
      </div>
    </div>
  )
}
