import { useEffect, useRef, useState } from 'react'
import { senses } from '../data/senses'
import FooterNav from './FooterNav'
import TopNav from './TopNav'
import Marquee from './Marquee'
import heroGridOverlay from '../assets/hero-grid-overlay.svg'

// Single full-screen "detail" page for one sense — drilled into from the
// SenseGallery. Same hero composition as the homepage (photo + ringed mark +
// left heading / right description) but re-themed per sense, with the
// footer nav's active tab underlined in that sense's accent color.
export default function SenseDetail({ open, activeKey, onSelect, onBack, onClose }) {
  const scrollRef = useRef(null)
  const footerRef = useRef(null)
  const [footerVisible, setFooterVisible] = useState(false)

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

  // Hides the mobile peek bar once the real footer nav has scrolled into
  // view, so the active sense isn't shown twice at once.
  useEffect(() => {
    if (!open) return
    const node = footerRef.current
    const root = scrollRef.current
    if (!node || !root) return
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {
      root,
      threshold: 0,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [open, activeKey])

  if (!open) return null

  const sense = senses.find((s) => s.key === activeKey) ?? senses[0]

  return (
    <div ref={scrollRef} className="animate-overlay-fade fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black">
      <TopNav />
      <div className="flex items-center px-6 py-3 sm:px-10" style={{ background: '#191BDF' }}>
        <Marquee />
      </div>

      {/* on mobile this is forced to fill at least the full viewport height,
          so the footer nav sits below the fold and only appears once the
          page is scrolled — on sm+ it just fits the available space like before */}
      <main key={sense.key} className="animate-panel-in relative flex min-h-[100svh] flex-1 flex-col sm:min-h-0">
        {/* back to gallery / close to home */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to overview"
          className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {/* per-sense photo — swap the file in src/assets/images/senses/ to update */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${sense.bg})` }}
          />
          <div className="absolute inset-0" style={{ background: '#00000099' }} />
          <img
            src={heroGridOverlay}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* right description */}
        <div className="pointer-events-none absolute right-6 top-1/2 hidden max-w-[280px] -translate-y-1/2 text-right font-roboto text-[13px] leading-relaxed text-white/70 sm:block sm:right-14">
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
        <div className="relative flex flex-1 flex-col items-center justify-start gap-6 px-6 pb-10 pt-20 sm:flex-row sm:justify-center sm:gap-0 sm:py-16 sm:py-24">
          {/* left label — desktop/tablet only */}
          <div className="absolute left-6 top-1/2 hidden -translate-y-24 text-left sm:block sm:left-14 md:left-24">
            <p className="font-roboto text-sm font-normal leading-[18px] text-white">
              {sense.element}
            </p>
            <h1
              className="mt-[15px] font-heading text-[clamp(28px,2.6vw,48px)] font-semibold leading-tight tracking-[-0.32px]"
              style={{ color: sense.accent }}
            >
              {sense.title}
            </h1>
            <p className="mt-[15px] font-roboto text-[11px] uppercase tracking-[0.2em] text-white/50">
              Intelligence / {sense.element} · {sense.sense}
            </p>
          </div>

          {/* accent ring + recolored mark */}
          <div className="relative flex h-[220px] w-[220px] shrink-0 items-center justify-center sm:h-[380px] sm:w-[380px]">
            <div
              key={sense.key}
              className="animate-spin-once absolute inset-0 rounded-full border"
              style={{ borderColor: sense.accent }}
            />
            <img
              key={sense.key}
              src={sense.centerImage}
              alt={`${sense.element} — ${sense.title}`}
              className="animate-spin-once relative w-[65%]"
            />
            <p className="absolute bottom-2 font-roboto text-xs text-white/60 sm:bottom-4">
              {sense.element}
            </p>
          </div>

          {/* title + description — mobile only, shown below the mark and
              above the footer nav */}
          <div className="flex max-w-xs flex-col items-center gap-3 text-center sm:hidden">
            <p className="font-roboto text-[11px] uppercase tracking-[0.2em] text-white/50">
              {sense.element} · {sense.sense}
            </p>
            <h1
              className="font-heading text-2xl font-semibold leading-tight tracking-[-0.32px]"
              style={{ color: sense.accent }}
            >
              {sense.title}
            </h1>
            <p className="font-roboto text-sm leading-relaxed text-white/70">
              {sense.description}
            </p>
          </div>
        </div>
      </main>

      {/* mobile-only peek bar: shows just the active sense, pinned to the
          bottom of the screen, until the full footer scrolls into view */}
      <button
        type="button"
        onClick={() => footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })}
        aria-label="Show all senses"
        className={`sticky bottom-0 z-20 h-[100px] w-full items-center justify-between gap-4 border-t border-white/10 bg-arcelblack px-6 text-left sm:hidden ${
          footerVisible ? "hidden" : "flex"
        }`}
        style={{ boxShadow: `inset 0 -3px 0 0 ${sense.accent}` }}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 whitespace-normal">
          <p
            className="font-sans text-[clamp(9px,0.55vw,12px)] font-normal leading-[clamp(13px,0.75vw,16px)]"
            style={{ color: sense.accent }}
          >
            {sense.element}
          </p>
          <p className="font-heading text-[clamp(15px,0.65vw,21px)] font-medium leading-[clamp(19px,1.3vw,26px)] tracking-[-0.16px] text-white">
            {sense.title}
          </p>
        </div>
        <img src={sense.icon} alt="" className="h-7 w-7 shrink-0 object-contain" />
      </button>

      <div ref={footerRef}>
        <FooterNav activeKey={sense.key} onSelect={onSelect} />
      </div>
    </div>
  )
}
