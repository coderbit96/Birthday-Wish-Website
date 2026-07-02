import { useMemo } from 'react'

const defaultPalette = ['#ef6f82', '#f0bd62', '#7ec4b8', '#8f76d8', '#f6a66f']

function ConfettiAnimation({ replayKey, palette = defaultPalette, variant = 'love' }) {
  const pieces = useMemo(() => Array.from({ length: 42 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 9) * 0.12}s`,
    duration: `${2.8 + (index % 6) * 0.22}s`,
    color: palette[index % palette.length],
    rotate: `${(index * 47) % 180}deg`,
  })), [palette])

  return (
    <div className={`confetti confetti-${variant}`} aria-hidden="true">
      {pieces.map((piece) => (
        <i key={`${replayKey}-${piece.id}`} style={{ '--left': piece.left, '--delay': piece.delay, '--duration': piece.duration, '--color': piece.color, '--rotate': piece.rotate }} />
      ))}
    </div>
  )
}

export default ConfettiAnimation
