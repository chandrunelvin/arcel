import { useEffect, useState } from 'react'
import logo0 from '../assets/images/gif-image/inteligent0.png'
import logo1 from '../assets/images/gif-image/dvelopment1.png'
import logo2 from '../assets/images/gif-image/design2.png'
import logo3 from '../assets/images/gif-image/construction3.png'
import logo4 from '../assets/images/gif-image/opetration4.png'
import logo5 from '../assets/images/gif-image/practice4.png'

const frames = [logo0, logo1, logo2, logo3, logo4, logo5]
const ringColors = ['#4E4E4E', '#FFC639', '#895EF6', '#F90D21', '#20CBDD', '#7AE3A9']

// The hero mark: cycles through the six per-sense marks, each one doing a
// full 1s spin as it's revealed then holding for a beat, framed by the two
// concentric rings from the source design, then hands off via onComplete
// once the sequence has played through.
export default function LogoMark({ onComplete }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const isLastFrame = frame === frames.length - 1
    const timer = setTimeout(() => {
      if (isLastFrame) {
        onComplete?.()
      } else {
        setFrame((f) => f + 1)
      }
    }, 2200)
    return () => clearTimeout(timer)
  }, [frame, onComplete])

  return (
    <div className="relative flex h-[clamp(180px,34vh,280px)] w-[clamp(180px,34vh,280px)] items-center justify-center sm:h-[clamp(220px,38vh,380px)] sm:w-[clamp(220px,38vh,380px)]">
      {/* outer blue ring */}
      <div className="absolute inset-0 rounded-full border border-[#191bdf]" />
      {/* inner ring — recolored per frame */}
      <div
        className="absolute inset-[19%] rounded-full border-2"
        style={{ borderColor: ringColors[frame] }}
      />

      <div className="relative w-[46%] drop-shadow-[0_0_25px_rgba(34,34,232,0.35)]">
        <img
          key={frame}
          src={frames[frame]}
          alt="ARCEL"
          className="animate-spin-once w-full"
        />
      </div>
    </div>
  )
}
