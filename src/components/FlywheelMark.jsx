// Wipe geometry per wedge (data-beat 0-5) — each rect sits on its blade's
// long axis; growing its width from 0 reveals that blade's color fill
// running outward from the hub.
const WIPES = [
  { beat: 0, width: 40.769, transform: 'translate(34.417 66.099) rotate(58.21) translate(-25.681 0)', y: -9.412, height: 18.825 },
  { beat: 1, width: 45.635, transform: 'translate(19.044 43.953) rotate(125.52) translate(-19.932 0)', y: -10.009, height: 20.018 },
  { beat: 2, width: 44.204, transform: 'translate(25.691 22.382) rotate(178.82) translate(-20.732 0)', y: -9.408, height: 18.816 },
  { beat: 3, width: 42.618, transform: 'translate(49.875 21.379) rotate(238.92) translate(-20.118 0)', y: -9.362, height: 18.724 },
  { beat: 4, width: 45.595, transform: 'translate(66.727 33.946) rotate(-54.73) translate(-28.735 0)', y: -10.369, height: 20.738 },
  { beat: 5, width: 44.278, transform: 'translate(53.402 61.646) rotate(-1.2) translate(-20.732 0)', y: -9.415, height: 18.829 },
]

const BEATS = [
  { beat: 0, color: 'var(--earth)', edge: 'M46.0899 75.7321L34.6055 82.3717L18.8096 54.9772L26.4903 41.6803L46.0899 75.7321Z' },
  { beat: 1, color: 'var(--air)', edge: 'M33.0264 30.3666L11.4844 67.6586L0 61.018L17.6816 30.3549L33.0264 30.3666Z' },
  { beat: 2, color: 'var(--fire)', edge: 'M38.1791 17.0634L45.8422 30.3769L3.1283 30.3427V17.0634H38.1791Z' },
  { beat: 3, color: 'var(--water)', edge: 'M60.3942 28.9854L52.7116 42.2832L32.195 6.63965L43.6813 0L60.3942 28.9854Z' },
  { beat: 4, color: 'var(--ether)', edge: 'M79.1656 23.0106L61.484 53.6747L46.1393 53.662L67.6813 16.371L79.1656 23.0106Z' },
  { beat: 5, color: 'var(--arcel-blue)', edge: 'M40.8459 66.9643H76.036V53.6867L33.2478 53.6518L40.8459 66.9643Z' },
]

// beatIndex: how many beats (0-5) have been reached so far — each wedge up
// to and including that beat stays filled, so by the final beat (5, the
// "ARCEL Intelligence" section) every wedge is lit at once. -1/undefined
// means none revealed yet (fully outlined, no color).
export default function FlywheelMark({ beatIndex = 5 }) {
  return (
    <div className="flywheel relative h-full w-full pointer-events-none text-white">
      <svg
        className="flywheel__svg"
        viewBox="0 0 79.1656 82.3717"
        overflow="visible"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {WIPES.map((w) => (
            <clipPath key={w.beat} id={`fwwipe-${w.beat}`} clipPathUnits="userSpaceOnUse">
              <rect
                transform={w.transform}
                x="0"
                y={w.y}
                width={beatIndex >= w.beat ? w.width : 0}
                height={w.height}
                style={{
                  opacity: beatIndex >= w.beat ? 1 : 0,
                  transition: 'width 0.7s cubic-bezier(0.22,0.61,0.36,1), opacity 0.4s ease-out',
                }}
              />
            </clipPath>
          ))}
        </defs>

        <g data-fill-rotor="">
          {BEATS.map((b) => (
            <g key={b.beat} data-beat={b.beat}>
              <path className="mk__edge" d={b.edge} />
              <path className="mk__ink" d={b.edge} fill={b.color} clipPath={`url(#fwwipe-${b.beat})`} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
