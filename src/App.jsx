import { useEffect, useState } from 'react'
import TopNav from './components/TopNav'
import Marquee from './components/Marquee'
import FooterNav from './components/FooterNav'
import SenseGallery from './components/SenseGallery'
import SenseDetail from './components/SenseDetail'
import FlywheelMark from './components/FlywheelMark'
import heroGridOverlay from './assets/hero-grid-overlay.svg'
import intelligenceBg from './assets/images/senses/intelligence-image-bg.webp'
import { senses } from './data/senses'

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

// Timing for the home hero's auto-rotation, kept in lockstep with the
// FlywheelMark rotor: 6 wedges (0-5), each lighting up 1600ms apart for a
// 9.6s full spin (see the --wipe-delay values + flywheel-rotate/-wipe
// durations in index.css). Wedges 0-4 map to the five senses; wedge 5 is
// the mark's own blue "brand" beat, after which the gallery opens.
const BEAT_MS = 1600
const BEATS = 6

// Sixth beat's content — the flywheel's own "brand" wedge — shown once the
// five senses have each had their turn, right before the gallery opens.
const FINALE = {
  key: 'intelligence',
  title: 'ARCEL Intelligence',
  label: 'THE SIX SENSES',
  description:
    'The built environment is perceived through five senses, five faculties, each grasping one part of the whole. ARCEL is the sixth, the mind that coordinates them.',
  bg: intelligenceBg,
}

function App() {
  // view: 'closed' | 'gallery' | 'detail'
  const [nav, setNav] = useState({ view: 'closed', activeKey: null })
  // -1 = "not started yet": the mark sits fully unfilled for one frame so
  // wedge 0 visibly wipes in on load/return instead of appearing pre-filled
  const [beatIndex, setBeatIndex] = useState(-1)
  const isMobile = useIsMobile()

  // advance one wedge at a time, in sync with the flywheel's own timing,
  // for as long as we're sitting on the home view. The -1 -> 0 kickoff is
  // its own (near-immediate) step so React commits the empty mark first.
  useEffect(() => {
    if (nav.view !== 'closed') return
    if (beatIndex === -1) {
      const id = requestAnimationFrame(() => setBeatIndex(0))
      return () => cancelAnimationFrame(id)
    }
    const id = setTimeout(() => setBeatIndex((b) => b + 1), BEAT_MS)
    return () => clearTimeout(id)
  }, [beatIndex, nav.view])

  // once the flywheel completes a full 6-wedge cycle, open the gallery —
  // on mobile too, so the "ARCEL Intelligence" lockup shows there as well,
  // instead of skipping straight to the Development detail page. Manual
  // footer taps below still take mobile straight to the detail page.
  useEffect(() => {
    if (beatIndex < BEATS) return
    setNav({ view: 'gallery', activeKey: senses[0].key })
  }, [beatIndex])

  // reset back to the unfilled mark whenever we return to the home view
  useEffect(() => {
    if (nav.view === 'closed') setBeatIndex(-1)
  }, [nav.view])

  const isFinale = beatIndex >= senses.length
  const homeSense = isFinale ? FINALE : senses[Math.max(beatIndex, 0)]
  // footer nav has no tab for the finale beat, so it just holds on the last
  // sense (Practice) while the finale content shows above it
  const footerSense = senses[Math.min(Math.max(beatIndex, 0), senses.length - 1)]

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
          {/* all five sense photos stay mounted, stacked, and crossfade via
              opacity — this is a true crossfade (outgoing fades out while
              incoming fades in simultaneously) rather than a hard swap */}
          {[...senses, FINALE].map((sense) => (
            <div
              key={sense.key}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                backgroundImage: `url(${sense.bg})`,
                opacity: sense.key === homeSense.key ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0" style={{ background: '#00000099' }} />
          <img
            src={heroGridOverlay}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* five senses paragraph — not present in the photo, kept as an overlay */}
        <div
          key={homeSense.key}
          className="animate-hero-fade pointer-events-none absolute right-6 top-1/2 hidden max-w-[360px] -translate-y-1/2 text-right font-roboto text-base leading-7 text-white/92 sm:block sm:right-14"
        >
          {homeSense.description}
        </div>

        {/* center content — stacked (mark, then title/description) on
            mobile since there's no room for the absolute side text there;
            centered mark only on sm+, with the absolute side text back */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-6 sm:min-h-0 sm:py-10">
          {/* left label — desktop/tablet only */}
          <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 text-left sm:block sm:left-14 md:left-24">
            <div key={homeSense.key} className="animate-hero-fade">
              <h1
                className="font-heading text-2xl font-semibold leading-tight tracking-[-0.32px] text-white sm:text-3xl"
              >
                {homeSense.title}
              </h1>
              {isFinale ? (
                <p className="mt-[15px] font-roboto text-xs font-normal leading-[16px] uppercase tracking-[0.2em] text-white/70">
                  {homeSense.label}
                </p>
              ) : (
                <p className="mt-[15px] font-roboto text-xs font-normal leading-[16px] uppercase tracking-[0.2em]">
                  <span className="text-white">Intelligence / </span>
                  <span style={{ color: homeSense.accent }}>{homeSense.element.toUpperCase()}</span>
                  <span className="text-white"> · {homeSense.sense}</span>
                </p>
              )}
            </div>
          </div>

          <div className="relative flex h-[clamp(180px,34vh,280px)] w-[clamp(180px,34vh,280px)] items-center justify-center sm:h-[clamp(120px,38vh,380px)] sm:w-[clamp(120px,38vh,380px)]">
            <div className="relative h-[78%] w-[78%]">
              <FlywheelMark beatIndex={nav.view === 'closed' ? beatIndex : BEATS - 1} />
            </div>
          </div>

          {/* title + description — mobile only, shown below the mark and
              above the footer nav */}
          <div
            key={homeSense.key}
            className="animate-hero-fade flex max-w-sm flex-col items-center gap-3 text-center sm:hidden"
          >
            <h1
              className="font-heading text-2xl font-semibold leading-tight tracking-[-0.32px] text-white"
            >
              {homeSense.title}
            </h1>
            {isFinale ? (
              <p className="font-roboto text-sm font-normal uppercase tracking-[0.2em] text-white/70">
                {homeSense.label}
              </p>
            ) : (
              <p className="font-roboto text-sm font-normal uppercase tracking-[0.2em]">
                <span className="text-white/70">Intelligence / </span>
                <span style={{ color: homeSense.accent }}>{homeSense.element.toUpperCase()}</span>
                <span className="text-white/70"> · {homeSense.sense}</span>
              </p>
            )}
            <p className="font-roboto text-base leading-7 text-white/88">
              {homeSense.description}
            </p>
          </div>
        </div>
      </main>

      {/* footer nav: desktop opens the gallery, mobile jumps straight to
          the full detail page and skips the gallery entirely. No tab is
          "Intelligence", so none is marked active during the finale beat. */}
      <FooterNav
        activeKey={nav.view === 'closed' ? (isFinale ? null : footerSense.key) : nav.activeKey}
        rotationMs={nav.view === 'closed' && !isFinale ? BEAT_MS : undefined}
        onSelect={(key) => setNav({ view: isMobile ? 'detail' : 'gallery', activeKey: key })}
      />

      <SenseGallery
        open={nav.view === 'gallery'}
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
