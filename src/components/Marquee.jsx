import movingText from '../assets/images/header-image/moving-text-05.png'

// LED/dot-matrix style ticker, e.g. "LAUNCHING · 15 · OCTOBER" — rendered
// as a repeating background strip so it can scroll endlessly without the
// visible handoff artifacts of moving discrete <img> elements.
export default function Marquee({ text = 'LAUNCHING 15 OCTOBER' }) {
  return (
    <div className="relative h-6 w-full overflow-hidden sm:h-8">
      <div
        aria-label={text}
        role="img"
        className="animate-marquee-background h-full w-[200%]"
        style={{
          backgroundImage: `url(${movingText})`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: '0 50%',
          backgroundSize: 'auto 100%',
        }}
      />
    </div>
  )
}
