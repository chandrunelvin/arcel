import { useMemo } from 'react'
import DotMatrixText from './DotMatrixText'

// Countdown target — change here if the launch date ever moves.
const LAUNCH_DATE = new Date('2026-10-15T00:00:00')

function useDaysToGo() {
  return useMemo(() => {
    const diffMs = LAUNCH_DATE.getTime() - Date.now()
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  }, [])
}

// LED-style ticker — real text (not a baked image) so the rotating set of
// messages, including the live day countdown, can actually change. Two
// identical copies of the message list sit side by side in a `w-max` flex
// row that translates by exactly -50%, so the loop point is seamless
// regardless of how long the messages end up being. Each message is its
// own element with a fixed right margin for spacing, rather than a joined
// string with a separator character between words.
export default function Marquee() {
  const daysToGo = useDaysToGo()

  const messages = [
    'LAUNCHING 05 OCT 2026',
    'KONNECT',
    'VAULT',
    'AND MUCH MORE',
    'AEC + RE',
    `${daysToGo} MORE DAYS TO GO`,
    'GLOBAL YET LOCAL',
  ]

  const renderMessages = (hidden) =>
    messages.map((message, i) => (
      <DotMatrixText key={i} text={message} className="mr-12" aria-hidden={hidden || undefined} />
    ))

  return (
    <div className="relative h-6 w-full overflow-hidden sm:h-8">
      <div
        role="img"
        aria-label={messages.join(', ')}
        className="animate-marquee-text flex h-full w-max items-center whitespace-nowrap text-2xl sm:text-[32px]"
      >
        {renderMessages(false)}
        {renderMessages(true)}
      </div>
    </div>
  )
}
