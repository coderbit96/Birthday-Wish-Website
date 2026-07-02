const balloonColors = ['#eb6f82', '#f4b85f', '#8b72d3', '#78bcae', '#f29d70', '#d95071']

function BalloonAnimation({ replayKey }) {
  return (
    <div className="balloons" aria-hidden="true">
      {balloonColors.map((color, index) => (
        <div className={`balloon balloon-${index + 1}`} key={`${replayKey}-${color}`} style={{ '--balloon': color, '--delay': `${index * 0.32}s` }}>
          <i /><span />
        </div>
      ))}
    </div>
  )
}

export default BalloonAnimation
