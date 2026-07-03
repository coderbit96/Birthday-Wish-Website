import { ArrowRight, Gift, Heart, PartyPopper, Sparkles } from 'lucide-react'
import CopyrightMark from './CopyrightMark'

function Home({ onCreate }) {
  return (
    <div className="home-page">
      <nav className="nav shell" aria-label="Main navigation">
        <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0 })}>
          <span className="brand-mark"><Gift size={19} /></span>
          wishly<span>.</span>
        </button>
        <button className="nav-cta" type="button" onClick={onCreate}>Create a wish</button>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> MADE WITH LOVE, JUST FOR THEM</div>
          <h1>Create a birthday moment they’ll <em>never forget.</em></h1>
          <p className="hero-subtitle">
            Turn your favorite photo and a few heartfelt words into a magical little celebration—made by you, for them.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={onCreate} data-testid="hero-create">
              Create Birthday Wish <ArrowRight size={18} />
            </button>
            <span className="tiny-note"><span>♡</span> No sign-up. Just joy.</span>
          </div>
          <div className="love-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>🧑🏽</span><span>👩🏻</span><span>👨🏾</span>
            </div>
            <div><strong>Loved by 10,000+ wish-makers</strong><small>Every message starts with someone special.</small></div>
          </div>
        </div>

        <div className="hero-art" aria-label="Birthday wish preview">
          <span className="doodle doodle-star">✦</span>
          <span className="doodle doodle-heart">♡</span>
          <div className="preview-card">
            <div className="preview-ribbon"><span>MAKE A WISH</span></div>
            <div className="preview-photo-wrap">
              <img src="/default-photo-realistic.png" alt="A joyful birthday celebration" />
              <span className="mini-sticker">HBD!</span>
            </div>
            <p className="script-word">Happy Birthday</p>
            <h2>TO MY FAVORITE PERSON</h2>
            <div className="preview-divider"><Heart size={14} fill="currentColor" /></div>
            <p>May this next trip around the sun be your most beautiful one yet.</p>
            <div className="preview-footer"><span>WITH ALL MY LOVE</span><span>♥</span></div>
          </div>
          <span className="float-pill pill-one"><PartyPopper size={16} /> confetti included</span>
          <span className="float-pill pill-two">made in 2 minutes <Sparkles size={15} /></span>
        </div>
      </section>

      <section className="steps-strip">
        <div className="shell steps">
          <div><span>01</span><p><strong>Add their details</strong>A name, a photo, a little context.</p></div>
          <div><span>02</span><p><strong>Write from the heart</strong>Say it exactly the way you feel it.</p></div>
          <div><span>03</span><p><strong>Make their day</strong>Reveal a celebration made just for them.</p></div>
        </div>
      </section>
      <footer className="site-copyright"><CopyrightMark /></footer>
    </div>
  )
}

export default Home
