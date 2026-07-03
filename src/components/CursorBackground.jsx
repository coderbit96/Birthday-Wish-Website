import { useEffect, useRef } from 'react'

const trailLength = 9

function CursorBackground() {
  const glow = useRef(null)
  const trail = useRef([])

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return undefined

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const positions = Array.from({ length: trailLength }, () => ({ ...pointer }))
    let animationFrame = 0

    const move = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const animate = () => {
      positions[0].x += (pointer.x - positions[0].x) * .24
      positions[0].y += (pointer.y - positions[0].y) * .24

      for (let index = 1; index < positions.length; index += 1) {
        positions[index].x += (positions[index - 1].x - positions[index].x) * .28
        positions[index].y += (positions[index - 1].y - positions[index].y) * .28
      }

      if (glow.current) {
        const deltaX = pointer.x - positions[0].x
        const deltaY = pointer.y - positions[0].y
        const speed = Math.min(90, Math.hypot(deltaX, deltaY))
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
        glow.current.style.transform = `translate3d(${positions[0].x}px, ${positions[0].y}px, 0) rotate(${angle}deg) scale(${1 + speed / 260})`
      }

      trail.current.forEach((dot, index) => {
        if (dot) dot.style.transform = `translate3d(${positions[index].x}px, ${positions[index].y}px, 0) translate(-50%, -50%)`
      })

      animationFrame = window.requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', move, { passive: true })
    animationFrame = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', move)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="cursor-background active" aria-hidden="true">
      <span className="cursor-head" ref={glow}>
        <span className="cursor-glow" />
        <span className="cursor-ring cursor-ring-one" />
        <span className="cursor-ring cursor-ring-two" />
        {Array.from({ length: 6 }, (_, index) => (
          <i className="cursor-orbit-spark" key={index} style={{ '--spark-start': `${index * 60}deg`, '--spark-delay': `${index * -.28}s` }} />
        ))}
      </span>
      {Array.from({ length: trailLength }, (_, index) => (
        <i
          className="cursor-trail-dot"
          key={index}
          ref={(element) => { trail.current[index] = element }}
          style={{ '--trail-size': `${11 - index * .72}px`, '--trail-opacity': .46 - index * .042 }}
        />
      ))}
    </div>
  )
}

export default CursorBackground
