import { useEffect } from 'react'
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
    <div className="animate-overlay-fade fixed inset-0 z-50 flex flex-col bg-black">
      <TopNav />
      <div className="flex items-center px-6 py-3 sm:px-10" style={{ background: '#191BDF' }}>
        <Marquee />
      </div>

      <main key={sense.key} className="animate-panel-in relative flex flex-1 flex-col overflow-hidden">
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

        {/* center content */}
        <div className="relative flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
          {/* left label */}
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
          <div className="relative flex h-[280px] w-[280px] items-center justify-center sm:h-[380px] sm:w-[380px]">
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
        </div>
      </main>

      <FooterNav activeKey={sense.key} onSelect={onSelect} />
    </div>
  )
}
