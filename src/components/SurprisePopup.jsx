import { Sparkles, X } from 'lucide-react'

const surprises = {
  Love: { mark: '∞', title: 'My favorite person,', emphasis: 'in every lifetime.', caption: 'Loving you is still the easiest, best thing I know.' },
  Friend: { mark: '✦', title: 'Lifetime membership', emphasis: 'in the chaos committee.', caption: 'No refunds. Too many excellent stories still to make.' },
  Family: { mark: '○', title: 'Wherever we go,', emphasis: 'we carry home with us.', caption: 'You are a beautiful part of every chapter we share.' },
  Sister: { mark: '◇', title: 'My first friend,', emphasis: 'my forever confidante.', caption: 'Different lives, one unbreakable sisterhood.' },
  Brother: { mark: '↗', title: 'Different paths,', emphasis: 'always the same team.', caption: 'Brotherhood means I am in your corner for life.' },
  Wife: { mark: '♥', title: 'I would choose you', emphasis: 'in every lifetime.', caption: 'My wife, my home, and still my favorite hello.' },
  Husband: { mark: '○', title: 'Every road is better', emphasis: 'with you beside me.', caption: 'My husband, my safe place, and my favorite adventure.' },
}

function SurprisePopup({ name, relationship, onClose }) {
  const surprise = surprises[relationship] || surprises.Love

  return (
    <div className="popup-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="surprise-popup" role="dialog" aria-modal="true" aria-labelledby="surprise-title">
        <button className="popup-close" type="button" onClick={onClose} aria-label="Close surprise"><X size={18} /></button>
        <span className="popup-sparkle"><Sparkles size={30} /></span>
        <div className="popup-monogram">{surprise.mark}</div>
        <p>ONE MORE THING, {name.toUpperCase()}…</p>
        <h2 id="surprise-title">{surprise.title}<br /><em>{surprise.emphasis}</em></h2>
        <span className="popup-caption">{surprise.caption}</span>
        <button className="button button-primary" type="button" onClick={onClose}>Keep this moment <Sparkles size={16} /></button>
      </section>
    </div>
  )
}

export default SurprisePopup
