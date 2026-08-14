import { useEffect } from 'react'
import { senses } from '../data/senses'
import TopNav from './TopNav'
import Marquee from './Marquee'

// Full-screen expanded view opened from the footer nav. Each column shows
// that sense's own background photo (senses.js `bg`), its own center
// artwork, tinted with that sense's accent, and a repeat of that sense's
// footer strip at the bottom.
export default function SenseGallery({ open, onClose, onSelect, activeKey }) {
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

  return (
    <div className="animate-overlay-fade fixed inset-0 z-50 flex flex-col bg-black">
      <TopNav />
      <div className="flex items-center px-6 py-3 sm:px-10" style={{ background: '#191BDF' }}>
        <Marquee />
      </div>

      <div className="relative grid flex-1 grid-cols-2 sm:grid-cols-5">
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

        {senses.map((sense, i) => {
          return (
            <button
              key={sense.key}
              type="button"
              onClick={() => onSelect?.(sense.key)}
              className="animate-panel-in group relative flex flex-col overflow-hidden border-r border-white/10 text-left last:border-r-0"
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

              {/* per-column footer strip, matching the main FooterNav exactly */}
              <div className="flex h-[clamp(100px,7.5vw,150px)] items-center justify-between gap-4 border-t border-white/10 bg-arcelblack px-6">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-2 whitespace-normal">
                  <p className="font-sans text-[clamp(11px,0.7vw,14px)] font-normal leading-[clamp(15px,0.9vw,18px)] text-white">
                    {sense.element}
                  </p>
                  <p className="font-heading text-[clamp(18px,0.8vw,26px)] font-medium leading-[clamp(22px,1.6vw,32px)] tracking-[-0.16px] text-white">
                    {sense.title}
                  </p>
                </div>
                <div className="flex h-[clamp(28px,2.2vw,58px)] w-[clamp(28px,2.2vw,58px)] shrink-0 items-center justify-center">
                  <img src={sense.icon} alt="" className="h-full w-full object-contain" />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
