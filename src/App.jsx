import { useState } from 'react'
import TopNav from './components/TopNav'
import Marquee from './components/Marquee'
import LogoMark from './components/LogoMark'
import FooterNav from './components/FooterNav'
import SenseGallery from './components/SenseGallery'
import SenseDetail from './components/SenseDetail'
import heroBg from './assets/hero-bg.png'
import heroGridOverlay from './assets/hero-grid-overlay.svg'

function App() {
  // view: 'closed' | 'gallery' | 'detail'
  const [nav, setNav] = useState({ view: 'closed', activeKey: null })

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <TopNav />

      {/* blue ticker strip */}
      <div className="flex items-center px-6 py-3 sm:px-10" style={{ background: '#191BDF' }}>
        <Marquee />
      </div>

      {/* hero */}
      <main className="relative flex flex-1 flex-col overflow-hidden bg-[#050505]">
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
        <div className="pointer-events-none absolute right-6 top-1/2 hidden max-w-[240px] -translate-y-1/2 text-right font-roboto text-[15px] leading-[19px] text-white sm:block sm:right-14">
          The built environment is perceived through five senses, five
          faculties, each grasping one part of the whole. ARCEL is the sixth,
          the mind that coordinates them.
        </div>

        {/* center content */}
        <div className="relative flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
          {/* left label */}
          <div className="absolute left-6 top-1/2 hidden -translate-y-24 text-left sm:block sm:left-14 md:left-24">
            <p className="font-roboto text-sm font-normal leading-[18px] text-white">AI</p>
            <h1 className="mt-[15px] font-heading text-4xl font-semibold leading-tight tracking-[-0.32px] text-white sm:text-5xl">
              ARCEL
              <br />
              Intelligence
            </h1>
            <p className="mt-[15px] font-roboto text-sm font-normal leading-[19px] text-white">
              THE SIX SENSES
            </p>
          </div>

          <LogoMark
            onComplete={() =>
              setNav((n) => (n.view === 'closed' ? { view: 'gallery', activeKey: null } : n))
            }
          />
        </div>
      </main>

      {/* footer nav opens the full gallery on click */}
      <FooterNav
        onSelect={(key) => setNav({ view: 'gallery', activeKey: key })}
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
