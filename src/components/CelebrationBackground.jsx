const balloons = [
  { left: '3%', delay: '-1s', duration: '12s', size: .78 },
  { left: '8%', delay: '-12s', duration: '17s', size: .48 },
  { left: '14%', delay: '-8s', duration: '15s', size: .58 },
  { left: '21%', delay: '-2s', duration: '13.5s', size: .86 },
  { left: '29%', delay: '-4s', duration: '13s', size: .68 },
  { left: '39%', delay: '-14s', duration: '18s', size: .46 },
  { left: '48%', delay: '-11s', duration: '16s', size: .52 },
  { left: '56%', delay: '-3s', duration: '12.8s', size: .82 },
  { left: '65%', delay: '-6s', duration: '14s', size: .72 },
  { left: '72%', delay: '-13s', duration: '17.5s', size: .5 },
  { left: '79%', delay: '-2s', duration: '12.5s', size: .6 },
  { left: '86%', delay: '-5s', duration: '14.5s', size: .88 },
  { left: '92%', delay: '-9s', duration: '15.5s', size: .76 },
  { left: '97%', delay: '-15s', duration: '18.5s', size: .44 },
]

const skyshots = [
  { left: '10%', top: '22%', delay: '-1s', duration: '6.8s' },
  { left: '24%', top: '38%', delay: '-6s', duration: '8.2s' },
  { left: '36%', top: '14%', delay: '-5s', duration: '7.4s' },
  { left: '49%', top: '32%', delay: '-8s', duration: '8.6s' },
  { left: '62%', top: '25%', delay: '-3s', duration: '6.4s' },
  { left: '75%', top: '39%', delay: '-2s', duration: '7.1s' },
  { left: '87%', top: '12%', delay: '-7s', duration: '7.8s' },
]

const sparkAngles = Array.from({ length: 12 }, (_, index) => `${index * 30}deg`)

function CelebrationBackground({ replayKey, palette }) {
  return (
    <div className="celebration-background" key={replayKey} aria-hidden="true">
      <div className="background-balloons">
        {balloons.map((balloon, index) => (
          <span
            className="celebration-balloon"
            key={`balloon-${index}`}
            style={{
              '--balloon-left': balloon.left,
              '--balloon-delay': balloon.delay,
              '--balloon-duration': balloon.duration,
              '--balloon-size': balloon.size,
              '--balloon-color': palette[index % palette.length],
            }}
          ><i /></span>
        ))}
      </div>

      {skyshots.map((shot, index) => (
        <span
          className="skyshot"
          key={`skyshot-${index}`}
          style={{
            '--shot-left': shot.left,
            '--shot-top': shot.top,
            '--shot-delay': shot.delay,
            '--shot-duration': shot.duration,
            '--shot-color': palette[(index + 1) % palette.length],
          }}
        >
          <i className="skyshot-trail" />
          <span className="skyshot-burst">
            {sparkAngles.map((angle) => <i key={angle} style={{ '--spark-angle': angle }} />)}
          </span>
        </span>
      ))}

      <span className="party-popper party-popper-left"><b>🎉</b><i /></span>
      <span className="party-popper party-popper-right"><b>🎉</b><i /></span>
      <span className="party-popper party-popper-upper-left"><b>🎉</b><i /></span>
      <span className="party-popper party-popper-upper-right"><b>🎉</b><i /></span>
    </div>
  )
}

export default CelebrationBackground
