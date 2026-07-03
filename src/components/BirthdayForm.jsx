import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Camera, Check, FileMusic, Gift, Heart, Image, Music2, Plus, Sparkles, Upload, Video, X } from 'lucide-react'
import { colorThemes, getColorTheme } from '../themeOptions'
import CopyrightMark from './CopyrightMark'

const relationships = ['Love', 'Friend', 'Family', 'Sister', 'Brother', 'Wife', 'Husband']

const suggestions = {
  Love: 'Every day with you feels like a gift. Today, I hope the whole world reminds you just how deeply you are loved.',
  Friend: 'Life is brighter, louder, and so much more fun with you in it. Here’s to more ridiculous adventures together!',
  Family: 'You make our family warmer just by being you. May this year bring back all the love you give so freely.',
  Sister: 'To my built-in best friend and forever confidante—may your birthday be as wonderful and one-of-a-kind as you are.',
  Brother: 'To the one who has always had my back—here’s to big dreams, good stories, and your happiest year yet.',
  Wife: 'You are the heart of our home and the love of my life. I would choose you in every lifetime. Happy birthday, my love.',
  Husband: 'Life beside you is my favorite adventure. Thank you for being my safe place, my joy, and my greatest love.',
}

const themeLabels = {
  Love: 'Romantic keepsake theme', Friend: 'Best-friends adventure theme', Family: 'Warm family legacy theme',
  Sister: 'Sisterhood glow theme', Brother: 'Brotherhood legacy theme', Wife: 'Elegant devotion theme', Husband: 'Steady adventure theme',
}

function BirthdayForm({ initialValues, onSubmit, onBack }) {
  const [form, setForm] = useState(() => {
    const images = initialValues.images?.length
      ? initialValues.images
      : initialValues.image
        ? [initialValues.image]
        : []

    return {
      ...initialValues,
      image: images[0] || '',
      images,
      musicType: initialValues.musicType || 'birthday',
      musicSrc: initialValues.musicSrc || '',
      musicName: initialValues.musicName || '',
      musicUrl: initialValues.musicUrl || '',
      message: initialValues.message || suggestions[initialValues.relationship],
    }
  })
  const [imageMode, setImageMode] = useState('upload')
  const [error, setError] = useState('')
  const fileInput = useRef(null)
  const audioInput = useRef(null)
  const selectedColorTheme = getColorTheme(form.color)
  const progressSteps = [
    { label: 'Their details', complete: Boolean(form.name.trim()) },
    { label: 'A photo', complete: form.images.some((image) => Boolean(String(image).trim())) },
    { label: 'Your message', complete: form.message.trim().length >= 20 },
    { label: 'Their style', complete: Boolean(form.relationship && form.color) },
  ]
  const completion = Math.round((progressSteps.filter((step) => step.complete).length / progressSteps.length) * 100)

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const chooseRelationship = (relationship) => {
    setForm((current) => ({
      ...current,
      relationship,
      message: suggestions[relationship],
    }))
  }

  const uploadImages = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setError('Please choose image files only.')
      return
    }

    const uploadedImages = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })))

    setForm((current) => {
      const images = [...current.images, ...uploadedImages].slice(0, 12)
      return { ...current, images, image: images[0] || '' }
    })
    setError(files.length + form.images.length > 12 ? 'You can add up to 12 photos.' : '')
    event.target.value = ''
  }

  const removeImage = (indexToRemove) => {
    setForm((current) => {
      const images = current.images.filter((_, index) => index !== indexToRemove)
      return { ...current, images, image: images[0] || '' }
    })
    setError('')
  }

  const updateImageUrl = (value) => {
    setForm((current) => ({ ...current, image: value, images: value ? [value] : [] }))
    setError('')
  }

  const uploadMusic = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('audio/')) {
      setError('Please choose an audio file such as MP3, WAV, M4A or OGG.')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Please choose a music file smaller than 15 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        music: true,
        musicType: 'custom',
        musicSrc: reader.result,
        musicName: file.name,
      }))
      setError('')
    }
    reader.onerror = () => setError('This music file could not be read. Please try another one.')
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const useBirthdayMusic = () => {
    setForm((current) => ({ ...current, music: true, musicType: 'birthday' }))
    setError('')
  }

  const useMusicLink = () => {
    setForm((current) => ({ ...current, music: true, musicType: 'link' }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Add their name to make this wish personal.')
      return
    }
    if (!form.images.some((image) => Boolean(String(image).trim()))) {
      setError('Add at least one favorite photo to create their birthday wish.')
      return
    }
    if (!form.message.trim()) {
      setError('Write a few words from the heart.')
      return
    }
    if (form.music && form.musicType === 'link') {
      try {
        const musicUrl = new URL(form.musicUrl)
        if (!['http:', 'https:'].includes(musicUrl.protocol)) throw new Error('Unsupported URL')
      } catch {
        setError('Add a valid YouTube, audio, or video link for the background music.')
        return
      }
    }

    let autoplayAudio = null
    let autoplayContext = null
    if (form.music) {
      const isYouTubeLink = form.musicType === 'link' && /(?:youtube\.com|youtu\.be)/i.test(form.musicUrl)
      const directMusicSource = form.musicType === 'custom'
        ? form.musicSrc
        : form.musicType === 'link' && !isYouTubeLink
          ? form.musicUrl
          : ''

      if (directMusicSource) {
        autoplayAudio = new window.Audio(directMusicSource)
        autoplayAudio.loop = true
        autoplayAudio.volume = 0.62
        autoplayAudio.play().catch(() => {})
      } else if (form.musicType === 'birthday') {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (AudioContext) {
          autoplayContext = new AudioContext()
          autoplayContext.resume().catch(() => {})
        }
      }
    }

    onSubmit({
      ...form,
      _autoplayAudio: autoplayAudio,
      _autoplayContext: autoplayContext,
      image: form.images[0] || '',
      images: form.images,
      name: form.name.trim(),
      message: form.message.trim(),
    })
  }

  return (
    <div
      className={`form-page form-theme-${form.relationship.toLowerCase()}`}
      style={{ '--form-accent': selectedColorTheme.accent, '--form-gradient': selectedColorTheme.gradient }}
    >
      <div className="form-ambient" aria-hidden="true">
        <span style={{ '--i': 0 }}>✦</span>
        <span style={{ '--i': 1 }}>♡</span>
        <span style={{ '--i': 2 }}>✦</span>
        <span style={{ '--i': 3 }}>♥</span>
        <span style={{ '--i': 4 }}>✦</span>
      </div>
      <nav className="nav shell form-nav">
        <button className="brand" type="button" onClick={onBack}>
          <span className="brand-mark"><Gift size={19} /></span> wishly<span>.</span>
        </button>
        <span className="secure-note"><Heart size={14} /> Private until you choose to share</span>
      </nav>

      <div className="form-shell shell">
        <aside className="form-aside">
          <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={17} /> Back home</button>
          <div className="eyebrow"><Sparkles size={14} /> THEIR MOMENT STARTS HERE</div>
          <h1>Let’s make something <em>beautiful.</em></h1>
          <p>A few little details are all it takes to create a birthday surprise that feels completely theirs.</p>
          <div className="form-live-preview" key={`${form.relationship}-${form.color}`}>
            <div className="live-preview-topline"><span><i /> LIVE PREVIEW</span><Sparkles size={14} /></div>
            <div className="live-preview-person">
              <span className="live-preview-avatar"><Gift size={20} /></span>
              <p>
                <small>A birthday moment for</small>
                <strong>{form.name.trim() || 'someone special'}</strong>
              </p>
            </div>
            <div className="live-preview-theme"><span>{form.relationship}</span><i /><span>{selectedColorTheme.label}</span></div>
          </div>
          <div className="form-promise">
            <span><Check size={16} /></span>
            <p><strong>Made by you</strong><small>Personal, heartfelt, and one of a kind.</small></p>
          </div>
          <div className="form-promise">
            <span><Check size={16} /></span>
            <p><strong>Ready in moments</strong><small>No design skills needed. We’ve got the magic.</small></p>
          </div>
          <blockquote>“The best gifts aren’t things. They’re the moments that make us feel truly known.”</blockquote>
        </aside>

        <form className="wish-form" onSubmit={handleSubmit} noValidate>
          <div className="form-heading">
            <span className="form-icon"><Gift size={21} /></span>
            <div><p>CREATE THEIR WISH</p><h2>Tell us about them</h2></div>
            <span className="form-ready-badge"><Sparkles size={12} /> {completion}% ready</span>
          </div>

          <div className="form-progress" aria-label={`Wish completion ${completion}%`}>
            <div className="form-progress-track"><span style={{ width: `${completion}%` }} /></div>
            <div className="form-progress-steps">
              {progressSteps.map((step, index) => (
                <span className={step.complete ? 'complete' : ''} key={step.label}>
                  <i>{step.complete ? <Check size={10} /> : index + 1}</i>{step.label}
                </span>
              ))}
            </div>
          </div>

          <label className="field-label" htmlFor="person-name">What’s their name? <span>*</span></label>
          <input id="person-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Ananya" />

          <fieldset>
            <legend>Who are they to you?</legend>
            <div className="relationship-grid">
              {relationships.map((item) => (
                <button className={form.relationship === item ? 'relationship active' : 'relationship'} type="button" key={item} onClick={() => chooseRelationship(item)}>
                  <span>{item === 'Love' || item === 'Wife' || item === 'Husband' ? '♥' : item === 'Friend' ? '✦' : '♡'}</span>{item}
                </button>
              ))}
            </div>
            <div className="theme-selection-note" key={form.relationship} role="status"><span /> {themeLabels[form.relationship]}</div>
          </fieldset>

          <fieldset aria-required="true">
            <legend>Add favorite photos <span className="required-mark">*</span> <small>(required, up to 12)</small></legend>
            <div className="tab-switcher">
              <button className={imageMode === 'upload' ? 'active' : ''} type="button" onClick={() => setImageMode('upload')}><Upload size={15} /> Upload</button>
              <button className={imageMode === 'url' ? 'active' : ''} type="button" onClick={() => setImageMode('url')}><Image size={15} /> Image URL</button>
            </div>
            {imageMode === 'upload' ? (
              <div className="photo-upload-group">
                <button className="upload-box" type="button" onClick={() => fileInput.current?.click()}>
                  <span className="upload-icon">{form.images.length ? <Plus size={20} /> : <Camera size={21} />}</span>
                  <span>
                    <strong>{form.images.length ? 'Add more photos' : 'Choose photos'}</strong>
                    <small>{form.images.length ? `${form.images.length} photo${form.images.length === 1 ? '' : 's'} selected` : 'JPG, PNG or WEBP · select several at once'}</small>
                  </span>
                  <input ref={fileInput} type="file" accept="image/*" multiple onChange={uploadImages} hidden />
                </button>
                {form.images.length > 0 && (
                  <div className="uploaded-photo-grid" aria-label="Selected photos">
                    {form.images.map((photo, index) => (
                      <figure className="uploaded-photo" key={`${photo.slice(0, 36)}-${index}`}>
                        <img src={photo} alt={`Selected photo ${index + 1}`} />
                        <span>{index + 1}</span>
                        <button type="button" onClick={() => removeImage(index)} aria-label={`Remove photo ${index + 1}`}><X size={13} /></button>
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <input type="url" value={form.image.startsWith('data:') ? '' : form.image} onChange={(e) => updateImageUrl(e.target.value)} placeholder="https://example.com/favorite-photo.jpg" />
            )}
          </fieldset>

          <label className="field-label" htmlFor="birthday-message">Your birthday message <span>*</span></label>
          <textarea id="birthday-message" value={form.message} onChange={(e) => update('message', e.target.value)} rows="5" maxLength="320" placeholder="Write something from the heart..." />
          <div className="character-count"><span style={{ width: `${Math.min(100, form.message.length / 3.2)}%` }} /> {form.message.length}/320</div>

          <div className="form-options">
            <fieldset>
              <legend>Choose their color theme</legend>
              <div className="color-row">
                {colorThemes.map((theme) => (
                  <button
                    type="button"
                    key={theme.id}
                    className={selectedColorTheme.id === theme.id ? 'color-swatch active' : 'color-swatch'}
                    style={{ '--swatch-gradient': theme.gradient, '--swatch-accent': theme.accent }}
                    onClick={() => update('color', theme.id)}
                    aria-label={`Use ${theme.label} theme`}
                    title={theme.label}
                  />
                ))}
              </div>
            </fieldset>
            <div className="music-option">
              <div className="music-option-head">
                <span><Music2 size={18} /><span><strong>Wish page music</strong><small>{form.musicType === 'custom' && form.musicName ? form.musicName : form.musicType === 'link' && form.musicUrl ? 'YouTube / media link' : 'Happy Birthday melody'}</small></span></span>
                <button type="button" role="switch" aria-checked={form.music} className={form.music ? 'toggle active' : 'toggle'} onClick={() => update('music', !form.music)}><i /></button>
              </div>
              <div className="music-picker">
                <button type="button" className={form.musicType === 'birthday' ? 'active' : ''} onClick={useBirthdayMusic}><Music2 size={13} /> Birthday song</button>
                <button type="button" className={form.musicType === 'custom' ? 'active' : ''} onClick={() => audioInput.current?.click()}><Upload size={13} /> My music</button>
                <button type="button" className={form.musicType === 'link' ? 'active' : ''} onClick={useMusicLink}><Video size={13} /> Video link</button>
                <input ref={audioInput} type="file" accept="audio/*,.mp3,.wav,.m4a,.ogg" onChange={uploadMusic} hidden />
              </div>
              {form.musicType === 'custom' && form.musicName && (
                <div className="selected-music">
                  <FileMusic size={15} />
                  <span><strong>{form.musicName}</strong><small>Your song will loop on the wish page</small></span>
                  <button type="button" onClick={useBirthdayMusic} aria-label="Remove custom music"><X size={13} /></button>
                </div>
              )}
              {form.musicType === 'link' && (
                <div className="music-link-field">
                  <Video size={15} />
                  <input type="url" value={form.musicUrl} onChange={(event) => update('musicUrl', event.target.value)} placeholder="Paste YouTube or direct media link" />
                  <small>YouTube controls its own ads. For guaranteed ad-free music, upload an audio file or use a direct media URL.</small>
                </div>
              )}
            </div>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary submit-button" type="submit">Create their birthday magic <Sparkles size={18} /></button>
          <p className="form-footnote">♡ Your details are only saved when you create a share link.</p>
        </form>
      </div>
      <footer className="site-copyright"><CopyrightMark /></footer>
    </div>
  )
}

export default BirthdayForm
