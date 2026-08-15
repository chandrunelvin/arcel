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

const WHITE = '#FFFFFF'
const YELLOW = '#FFC639'
const GREEN = '#27FB00'

// LED-style ticker — real text (not a baked image) so the rotating set of
// messages, including the live day countdown, can actually change. Two
// identical copies of the message list sit side by side in a `w-max` flex
// row that translates by exactly -50%, so the loop point is seamless
// regardless of how long the messages end up being. Each message is its
// own element with a fixed right margin for spacing, rather than a joined
// string with a separator character between words. Each message can be
// made of multiple colored segments — the day countdown is the number in
// green followed by "MORE DAYS TO GO" in white.
export default function Marquee() {
  const daysToGo = useDaysToGo()

  const messages = [
    { key: 'launch', segments: [{ text: 'LAUNCHING 05 OCT 2026', color: WHITE }] },
    { key: 'konnect', segments: [{ text: 'KONNECT', color: YELLOW }] },
    { key: 'vault', segments: [{ text: 'VAULT', color: GREEN }] },
    { key: 'more', segments: [{ text: 'AND MUCH MORE', color: WHITE }] },
    { key: 'aec', segments: [{ text: 'AEC + RE', color: WHITE }] },
    {
      key: 'days',
      segments: [
        { text: `${daysToGo}`, color: GREEN },
        { text: ' MORE DAYS TO GO', color: WHITE },
      ],
    },
    { key: 'global', segments: [{ text: 'GLOBAL YET LOCAL', color: WHITE }] },
  ]

  const renderMessages = (hidden) =>
    messages.map((message) => (
      <span
        key={message.key}
        className="mr-12 inline-flex items-end"
        aria-hidden={hidden || undefined}
      >
        {message.segments.map((segment, i) => (
          <DotMatrixText key={i} text={segment.text} color={segment.color} />
        ))}
      </span>
    ))

  return (
    <div className="relative h-6 w-full overflow-hidden sm:h-8">
      <div
        role="img"
        aria-label={messages.map((m) => m.segments.map((s) => s.text).join('')).join(', ')}
        className="animate-marquee-text flex h-full w-max items-center whitespace-nowrap text-2xl sm:text-[32px]"
      >
        {renderMessages(false)}
        {renderMessages(true)}
      </div>
    </div>
  )
}
