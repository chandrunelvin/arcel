// LED/dot-matrix style ticker, e.g. "LAUNCHING 15 OCTOBER" — a single line
// that scrolls once from right to left, then stays put. Real text (not an
// image): `.dot-matrix-text` in index.css fills the glyphs with a dot grid
// via background-clip, so it stays real, accessible, editable text while
// still reading as an LED display.
export default function Marquee({ text = 'LAUNCHING 15 OCTOBER' }) {
  return (
    <div className="relative flex w-full overflow-hidden">
      <span className="dot-matrix-text animate-marquee-once shrink-0 whitespace-nowrap font-mono text-3xl font-thin uppercase tracking-normal sm:text-4xl">
        {text}
      </span>
    </div>
  )
}
