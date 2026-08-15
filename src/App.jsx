import { useEffect, useState } from 'react'
import TopNav from './components/TopNav'
import Marquee from './components/Marquee'
import LogoMark from './components/LogoMark'
import FooterNav from './components/FooterNav'
import SenseGallery from './components/SenseGallery'
import SenseDetail from './components/SenseDetail'
import heroBg from './assets/hero-bg.png'
import heroGridOverlay from './assets/hero-grid-overlay.svg'

// Mirrors the Tailwind `sm` breakpoint used everywhere else in this app.
const MOBILE_QUERY = '(max-width: 639px)'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

function App() {
  // view: 'closed' | 'gallery' | 'detail'
  const [nav, setNav] = useState({ view: 'closed', activeKey: null })
  const isMobile = useIsMobile()

  return (
    <div className="flex min-h-screen flex-col bg-black sm:h-screen sm:overflow-hidden">
      <TopNav />

      {/* blue ticker strip */}
      <div className="flex items-center px-6 py-3 sm:px-10" style={{ background: '#191BDF' }}>
        <Marquee />
      </div>

      {/* hero — on mobile this is allowed to grow with the extra title/
          description text below the mark (page scrolls naturally); on
          sm+ it stays clamped to the available space like before */}
      <main className="relative flex flex-1 flex-col overflow-visible bg-[#050505] sm:min-h-0 sm:overflow-hidden">
        {/* real hero photo: Dubai skyline + architectural wireframe overlay
            (already carries the "Digital Twin", "Smart City OS" and
            "Architecture Intelligence" callouts baked into the image) */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0" style={{ background: '#00000099' }} />
          <img
            src={heroGridOverlay}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* five senses paragraph — not present in the photo, kept as an overlay */}
        <div className="pointer-events-none absolute right-6 top-1/2 hidden max-w-[240px] -translate-y-1/2 text-right font-roboto text-xs leading-[16px] text-white sm:block sm:right-14">
          The built environment is perceived through five senses, five
          faculties, each grasping one part of the whole. ARCEL is the sixth,
          the mind that coordinates them.
        </div>

        {/* center content — stacked (mark, then title/description) on
            mobile since there's no room for the absolute side text there;
            centered mark only on sm+, with the absolute side text back */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-6 sm:min-h-0 sm:py-10">
          {/* left label — desktop/tablet only */}
          <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 text-left sm:block sm:left-14 md:left-24">
            <p className="font-roboto text-xs font-normal leading-[16px] text-white">AI</p>
            <h1 className="mt-[15px] font-heading text-2xl font-semibold leading-tight tracking-[-0.32px] text-white sm:text-3xl">
              ARCEL
              <br />
              Intelligence
            </h1>
            <p className="mt-[15px] font-roboto text-xs font-normal leading-[16px] text-white">
              THE SIX SENSES
            </p>
          </div>

          <LogoMark
            loop={isMobile}
            onComplete={() =>
              setNav((n) => (n.view === 'closed' ? { view: 'gallery', activeKey: null } : n))
            }
          />

          {/* title + description — mobile only, shown below the mark and
              above the footer nav */}
          <div className="flex max-w-xs flex-col items-center gap-3 text-center sm:hidden">
            <p className="font-roboto text-xs font-normal text-white/70">AI</p>
            <h1 className="font-heading text-xl font-semibold leading-tight tracking-[-0.32px] text-white">
              ARCEL Intelligence
            </h1>
            <p className="font-roboto text-xs font-normal uppercase tracking-[0.2em] text-white/50">
              THE SIX SENSES
            </p>
            <p className="font-roboto text-xs leading-relaxed text-white/70">
              The built environment is perceived through five senses, five
              faculties, each grasping one part of the whole. ARCEL is the
              sixth, the mind that coordinates them.
            </p>
          </div>
        </div>
      </main>

      {/* footer nav: desktop opens the gallery, mobile jumps straight to
          the full detail page and skips the gallery entirely */}
      <FooterNav
        onSelect={(key) => setNav({ view: isMobile ? 'detail' : 'gallery', activeKey: key })}
      />

      <SenseGallery
        open={nav.view === 'gallery'}
        activeKey={nav.activeKey}
        onSelect={(key) => setNav({ view: 'detail', activeKey: key })}
        onClose={() => setNav({ view: 'closed', activeKey: null })}
      />

      <SenseDetail
        open={nav.view === 'detail'}
        activeKey={nav.activeKey}
        onSelect={(key) => setNav({ view: 'detail', activeKey: key })}
        onBack={() => setNav((n) => ({ view: 'gallery', activeKey: n.activeKey }))}
        onClose={() => setNav({ view: 'closed', activeKey: null })}
      />
    </div>
  )
}

export default App
