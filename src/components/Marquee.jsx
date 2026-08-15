import movingText from '../assets/images/header-image/moving-text-05.png'

// LED/dot-matrix style ticker, e.g. "LAUNCHING · 15 · OCTOBER" — a single
// line that scrolls once from right to left, then stays put.
export default function Marquee({ text = 'LAUNCHING 15 OCTOBER' }) {
  return (
    <div className="relative flex w-full overflow-hidden">
      <img
        src={movingText}
        alt={text}
        className="animate-marquee-once h-6 w-auto shrink-0 sm:h-8"
      />
    </div>
  )
}
