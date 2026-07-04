import { Sparkles, X } from 'lucide-react'

const relationshipMarks = {
  Love: '∞', Friend: '✦', Family: '○', Sister: '◇', Brother: '↗', Wife: '♥', Husband: '○',
}

function SurprisePopup({ name, relationship, onClose }) {
  const mark = relationshipMarks[relationship] || relationshipMarks.Love

  return (
    <div className="popup-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="surprise-popup" role="dialog" aria-modal="true" aria-labelledby="surprise-title">
        <button className="popup-close" type="button" onClick={onClose} aria-label="Close surprise"><X size={18} /></button>
        <span className="popup-sparkle"><Sparkles size={30} /></span>
        <div className="popup-monogram">{mark}</div>
        <p>ONE MORE THING, {name.toUpperCase()}…</p>
        <h2 id="surprise-title">You are not getting older, <em>you are becoming legendary!</em></h2>
        <span className="popup-caption">Some people age. You collect stories, sparkle, and legendary status.</span>
        <button className="button button-primary" type="button" onClick={onClose}>Keep this moment <Sparkles size={16} /></button>
      </section>
    </div>
  )
}

export default SurprisePopup
