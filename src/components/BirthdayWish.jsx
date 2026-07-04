import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, Check, Copy, ExternalLink, Gift, Heart, MessageCircle, Pencil, Play, Share2, Sparkles, Volume2, VolumeX, X } from 'lucide-react'
import ConfettiAnimation from './ConfettiAnimation'
import SurprisePopup from './SurprisePopup'
import { getColorTheme } from '../themeOptions'
import CopyrightMark from './CopyrightMark'

const themeProfiles = {
  Love: {
    id: 'love', kicker: 'A DAY FOR MY FAVORITE PERSON',
    scene: 'A little evening made entirely for us.', note: 'TO MY LOVE, IN THIS LIFE AND EVERY ONE AFTER',
    keepsake: 'Loving you has made even the ordinary days feel extraordinary.',
    closing: 'Here’s to more laughter, quiet moments, and a lifetime of choosing each other.',
    motifs: ['♥', '∞', '♥', '∞', '♥', '∞'], palette: ['#9e354b', '#d99a85', '#f0d1c0', '#6f2336'],
  },
  Friend: {
    id: 'friend', kicker: 'CHEERS TO MY PARTNER IN CHAOS',
    scene: 'For all the stories we have not lived yet.', note: 'TO MY FRIEND, FOR EVERY LAUGH AND LATE-NIGHT STORY',
    keepsake: 'The best friendships turn ordinary moments into favorite stories.',
    closing: 'Here’s to more adventures, ridiculous jokes, and memories only we could make.',
    motifs: ['✦', '·', '✦', '·', '✦', '·'], palette: ['#d6773d', '#e8b04d', '#5f8f89', '#b95638'],
  },
  Family: {
    id: 'family', kicker: 'CELEBRATING THE HEART OF OUR FAMILY',
    scene: 'The best memories always begin at home.', note: 'TO FAMILY — OUR ROOTS, OUR STORIES, OUR HOME',
    keepsake: 'Family is the love that remembers every version of us and stays.',
    closing: 'Here’s to another year of traditions, togetherness, and a home full of laughter.',
    motifs: ['○', '⌂', '○', '⌂', '○', '⌂'], palette: ['#9a663e', '#d0a15e', '#77856a', '#69472f'],
  },
  Sister: {
    id: 'sister', kicker: 'FOR MY BUILT-IN BEST FRIEND',
    scene: 'For my first friend and forever confidante.', note: 'TO MY SISTER, MY SAFE PLACE AND FAVORITE SECRET-KEEPER',
    keepsake: 'A sister carries your childhood memories and still cheers for who you are becoming.',
    closing: 'Here’s to more secrets, shared laughter, and always being in each other’s corner.',
    motifs: ['◇', '✦', '◇', '✦', '◇', '✦'], palette: ['#9b668b', '#d8a7bd', '#b69bc8', '#73516e'],
  },
  Brother: {
    id: 'brother', kicker: 'BROTHERS BY BLOOD, FRIENDS BY CHOICE',
    scene: 'For the one who has always had my back.', note: 'TO MY BROTHER, MY LIFELONG TEAMMATE',
    keepsake: 'A brother is a lifelong teammate who knows the whole story and stays on your side.',
    closing: 'Here’s to bigger dreams, better stories, and another year of having each other’s backs.',
    motifs: ['—', '↗', '—', '↗', '—', '↗'], palette: ['#315f78', '#668da0', '#b78354', '#203e50'],
  },
  Wife: {
    id: 'wife', kicker: 'TO THE HEART OF OUR HOME',
    scene: 'Still choosing you, every single day.', note: 'TO MY WIFE, MY HOME AND MY GREATEST LOVE',
    keepsake: 'Home is not a place to me—it is every life-giving moment I share with you.',
    closing: 'Here’s to the beautiful life we are building, one loving day at a time.',
    motifs: ['◇', '♥', '◇', '♥', '◇', '♥'], palette: ['#9d5c54', '#c9906d', '#d6b776', '#6f3c3c'],
  },
  Husband: {
    id: 'husband', kicker: 'TO MY FAVORITE ADVENTURE',
    scene: 'Home is wherever I am with you.', note: 'TO MY HUSBAND, MY SAFE PLACE AND STEADY HAND',
    keepsake: 'Life feels steadier, brighter, and more adventurous with your hand in mine.',
    closing: 'Here’s to every road ahead and the joy of walking it together.',
    motifs: ['↗', '○', '↗', '○', '↗', '○'], palette: ['#3f6258', '#7d8e6c', '#bd8b55', '#29443d'],
  },
}

const highlightsByTheme = {
  love: [
    { icon: '∞', title: 'Love without limits', text: 'May you always feel as deeply loved as you make others feel.' },
    { icon: '☀', title: 'Golden little moments', text: 'More slow mornings, stolen glances, and reasons to smile.' },
    { icon: '✦', title: 'Dreams coming true', text: 'May this be the year life surprises you in the loveliest ways.' },
  ],
  friend: [
    { icon: '↗', title: 'Big adventures', text: 'The kind that turn into stories we laugh about for years.' },
    { icon: '☺', title: 'Ridiculous amounts of joy', text: 'More belly laughs, happy chaos, and very questionable ideas.' },
    { icon: '✦', title: 'Main-character energy', text: 'May every room know the party arrived when you walk in.' },
  ],
  family: [
    { icon: '⌂', title: 'A heart full of home', text: 'May you always be surrounded by the people who know you best.' },
    { icon: '☀', title: 'Gentle, golden days', text: 'More peace, more laughter, and time for everything you love.' },
    { icon: '♡', title: 'Love returned to you', text: 'May all the warmth you give find its way right back home.' },
  ],
  sister: [
    { icon: '◇', title: 'A bond like no other', text: 'More honest talks, shared secrets, and knowing looks across the room.' },
    { icon: '✦', title: 'Your brightest chapter', text: 'May you take up space, trust your voice, and glow in your own way.' },
    { icon: '♡', title: 'Always in your corner', text: 'Wherever life takes us, you will never have to face it alone.' },
  ],
  brother: [
    { icon: '↗', title: 'Bigger horizons', text: 'May the next year bring bold plans, good risks, and stories worth retelling.' },
    { icon: '—', title: 'A steady kind of strength', text: 'Keep becoming the man who shows up, stands tall, and stays true.' },
    { icon: '○', title: 'Always on your team', text: 'No matter the distance or the season, I will always have your back.' },
  ],
  wife: [
    { icon: '♥', title: 'A love that deepens', text: 'More ordinary mornings that somehow still feel like the greatest gift.' },
    { icon: '◇', title: 'A life that feels like ours', text: 'More dreams built side by side, at our pace and in our own beautiful way.' },
    { icon: '✦', title: 'Everything you deserve', text: 'May the care you give so freely return to you a hundred times over.' },
  ],
  husband: [
    { icon: '↗', title: 'Our next adventure', text: 'More new roads, brave plans, and the quiet joy of finding our way together.' },
    { icon: '○', title: 'The home we carry', text: 'May you always know how safe, seen, and deeply loved you are with me.' },
    { icon: '✦', title: 'A year worthy of you', text: 'More purpose, laughter, and time for everything that makes you feel alive.' },
  ],
}

const happyBirthdayMelody = [
  [392.00, .5], [392.00, .5], [440.00, 1], [392.00, 1], [523.25, 1], [493.88, 2],
  [392.00, .5], [392.00, .5], [440.00, 1], [392.00, 1], [587.33, 1], [523.25, 2],
  [392.00, .5], [392.00, .5], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440.00, 2],
  [698.46, .5], [698.46, .5], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2.5],
]

function getYouTubeVideoId(value) {
  if (!value) return ''
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    let videoId = ''

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] || ''
    } else if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) {
      videoId = url.searchParams.get('v') || ''
      if (!videoId) {
        const parts = url.pathname.split('/').filter(Boolean)
        if (['embed', 'shorts', 'live'].includes(parts[0])) videoId = parts[1] || ''
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : ''
  } catch {
    return ''
  }
}

function BirthdayWish({ details, onEdit, onHome, createShareLink, onReplayCelebration }) {
  const [replayKey, setReplayKey] = useState(0)
  const [showSurprise, setShowSurprise] = useState(false)
  const [intro, setIntro] = useState(true)
  const [typedMessage, setTypedMessage] = useState('')
  const [musicOn, setMusicOn] = useState(false)
  const [shareStatus, setShareStatus] = useState('')
  const [shareBusy, setShareBusy] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const audioContext = useRef(details._autoplayContext || null)
  const audioElement = useRef(details._autoplayAudio || null)
  const primedPlaybackAdopted = useRef(false)
  const melodyTimer = useRef(null)
  const profile = themeProfiles[details.relationship] || themeProfiles.Love
  const theme = profile.id
  const highlights = highlightsByTheme[theme]
  const colorTheme = getColorTheme(details.color)
  const formattedBirthdayDate = details.birthdayDate
    ? new Date(`${details.birthdayDate}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const photos = details.images?.length ? details.images : details.image ? [details.image] : []
  const featuredPhoto = photos[0] || ''
  const galleryPhotos = photos.slice(1)
  const sceneImage = featuredPhoto || '/default-photo-realistic.png'
  const customMusicSelected = details.musicType === 'custom' && details.musicSrc
  const linkedMusicSelected = details.musicType === 'link' && details.musicUrl
  const youtubeVideoId = linkedMusicSelected ? getYouTubeVideoId(details.musicUrl) : ''
  const directMusicSource = customMusicSelected ? details.musicSrc : linkedMusicSelected && !youtubeVideoId ? details.musicUrl : ''
  const selectedMusicLabel = customMusicSelected
    ? (details.musicName || 'custom music')
    : linkedMusicSelected
      ? (youtubeVideoId ? 'YouTube background music' : 'linked background music')
      : 'Happy Birthday music'

  useEffect(() => {
    const introTimer = window.setTimeout(() => setIntro(false), 2800)
    return () => window.clearTimeout(introTimer)
  }, [replayKey])

  useEffect(() => {
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTypedMessage(details.message.slice(0, index))
      if (index >= details.message.length) window.clearInterval(timer)
    }, 28)
    return () => window.clearInterval(timer)
  }, [details.message, replayKey])

  const stopMelody = useCallback(() => {
    window.clearTimeout(melodyTimer.current)
    if (audioElement.current) {
      audioElement.current.pause()
      audioElement.current.currentTime = 0
      audioElement.current = null
    }
    if (audioContext.current) {
      audioContext.current.close()
      audioContext.current = null
    }
    setMusicOn(false)
  }, [])

  const startMelody = useCallback(() => {
    if (!primedPlaybackAdopted.current && directMusicSource && audioElement.current) {
      primedPlaybackAdopted.current = true
      setMusicOn(true)
      return
    }

    const primedContext = !primedPlaybackAdopted.current
      && !youtubeVideoId
      && !directMusicSource
      && audioContext.current
      && audioContext.current.state !== 'closed'

    let context = primedContext ? audioContext.current : null
    if (primedContext) primedPlaybackAdopted.current = true
    else stopMelody()

    if (youtubeVideoId) {
      setMusicOn(true)
      return
    }

    if (directMusicSource) {
      const audio = new window.Audio(directMusicSource)
      audio.loop = true
      audio.volume = 0.62
      audioElement.current = audio
      setMusicOn(true)
      audio.play().catch(() => {
        if (audioElement.current === audio) {
          audioElement.current = null
          setMusicOn(false)
        }
      })
      return
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    if (!context) {
      context = new AudioContext()
      audioContext.current = context
    }

    const masterGain = context.createGain()
    masterGain.gain.value = 0.14
    masterGain.connect(context.destination)
    const secondsPerBeat = 60 / 108

    const scheduleMelody = () => {
      if (audioContext.current !== context) return
      let cursor = context.currentTime + 0.08

      happyBirthdayMelody.forEach(([frequency, beats]) => {
        const duration = beats * secondsPerBeat
        const oscillator = context.createOscillator()
        const overtone = context.createOscillator()
        const noteGain = context.createGain()
        const overtoneGain = context.createGain()

        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(frequency, cursor)
        overtone.type = 'sine'
        overtone.frequency.setValueAtTime(frequency * 2, cursor)

        noteGain.gain.setValueAtTime(0.0001, cursor)
        noteGain.gain.exponentialRampToValueAtTime(0.7, cursor + 0.035)
        noteGain.gain.exponentialRampToValueAtTime(0.25, cursor + duration * 0.72)
        noteGain.gain.exponentialRampToValueAtTime(0.0001, cursor + duration * 0.94)
        overtoneGain.gain.setValueAtTime(0.08, cursor)
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, cursor + duration * 0.7)

        oscillator.connect(noteGain).connect(masterGain)
        overtone.connect(overtoneGain).connect(masterGain)
        oscillator.start(cursor)
        overtone.start(cursor)
        oscillator.stop(cursor + duration)
        overtone.stop(cursor + duration)
        cursor += duration
      })

      const loopDelay = (cursor - context.currentTime + 0.9) * 1000
      melodyTimer.current = window.setTimeout(scheduleMelody, loopDelay)
    }

    scheduleMelody()
    setMusicOn(true)
  }, [directMusicSource, stopMelody, youtubeVideoId])

  useEffect(() => {
    if (!details.music) return undefined
    const autoplayTimer = window.setTimeout(startMelody, 0)
    return () => window.clearTimeout(autoplayTimer)
  }, [details.music, startMelody])

  useEffect(() => () => {
    window.clearTimeout(melodyTimer.current)
    audioElement.current?.pause()
    audioContext.current?.close()
  }, [])

  const replay = () => {
    setIntro(true)
    setTypedMessage('')
    setReplayKey((key) => key + 1)
    onReplayCelebration()
    if (details.music) startMelody()
  }

  const showShareStatus = (message) => {
    setShareStatus(message)
    window.setTimeout(() => setShareStatus(''), 2600)
  }

  const copyText = async (text) => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch {
        // Fall back to the older copy command when clipboard permission is unavailable.
      }
    }

    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.readOnly = true
      textArea.style.position = 'fixed'
      textArea.style.top = '0'
      textArea.style.left = '-9999px'
      textArea.style.fontSize = '16px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      textArea.setSelectionRange(0, text.length)
      const copied = document.execCommand('copy')
      textArea.remove()
      return copied
    } catch {
      return false
    }
  }

  const copyGeneratedLink = async (url = generatedLink) => {
    const copied = await copyText(url)
    showShareStatus(copied ? 'Wish link copied!' : 'Clipboard blocked — tap Share instead.')
    return copied
  }

  const shareGeneratedLink = async (url = generatedLink) => {
    if (!url) return
    if (navigator.share) {
      try {
        await navigator.share({ title: `A birthday wish for ${details.name}`, url })
        showShareStatus('Share menu opened!')
        return
      } catch (error) {
        if (error.name === 'AbortError') return
      }
    }
    await copyGeneratedLink(url)
  }

  const copyWishLink = async () => {
    setShareBusy(true)
    try {
      const url = await createShareLink()
      setGeneratedLink(url)
      await copyGeneratedLink(url)
    } catch (error) {
      showShareStatus(error.message || 'Could not create the link. Please try again.')
    } finally {
      setShareBusy(false)
    }
  }

  const shareWish = async () => {
    const shareText = `Happy Birthday, ${details.name}! ${details.message}${details.fromName ? ` — From ${details.fromName}` : ''}`
    setShareBusy(true)
    try {
      const url = await createShareLink()
      setGeneratedLink(url)
      if (navigator.share) {
        await navigator.share({ title: `A birthday wish for ${details.name}`, text: shareText, url })
        showShareStatus('Wish shared!')
      } else {
        await copyGeneratedLink(url)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showShareStatus(error.message || 'Sharing was not available')
      }
    } finally {
      setShareBusy(false)
    }
  }

  const shareOnWhatsApp = async (url = generatedLink) => {
    const whatsappWindow = window.open('about:blank', 'birthday-wish-whatsapp')
    if (whatsappWindow) whatsappWindow.opener = null

    setShareBusy(true)
    try {
      const wishUrl = url || await createShareLink()
      setGeneratedLink(wishUrl)
      const shareText = `Happy Birthday, ${details.name}! ${details.message}${details.fromName ? ` — From ${details.fromName}` : ''}\n\nOpen your birthday surprise: ${wishUrl}`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl
      } else {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      }
      showShareStatus('Opening WhatsApp...')
    } catch (error) {
      whatsappWindow?.close()
      showShareStatus(error.message || 'Could not open WhatsApp. Please try again.')
    } finally {
      setShareBusy(false)
    }
  }

  return (
    <div
      className={`wish-page theme-${theme} has-custom-palette`}
      style={{
        '--personal-accent': colorTheme.accent,
        '--theme-accent': colorTheme.accent,
        '--theme-secondary': colorTheme.secondary,
        '--theme-ink': colorTheme.ink,
        '--theme-gradient': colorTheme.gradient,
        '--theme-surface': colorTheme.surface,
      }}
    >
      <ConfettiAnimation replayKey={replayKey} palette={[colorTheme.accent, colorTheme.secondary, '#f7e7dc', colorTheme.ink]} variant={theme} />
      {musicOn && youtubeVideoId && (
        <iframe
          className="background-music-player"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&loop=1&playlist=${youtubeVideoId}&controls=0&disablekb=1&fs=0&playsinline=1`}
          title="Background music player"
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      <div className="theme-ambient" aria-hidden="true">
        {profile.motifs.map((motif, index) => <span key={`${motif}-${index}`} style={{ '--i': index }}>{motif}</span>)}
      </div>

      {intro && (
        <div className="countdown-intro" aria-label="Birthday surprise loading">
          <span className="count-3">3</span><span className="count-2">2</span><span className="count-1">1</span><strong>MAKE A WISH!</strong>
        </div>
      )}

      <nav className="wish-nav shell">
        <button className="brand wish-brand" type="button" onClick={onHome}><span className="brand-mark"><Gift size={19} /></span> wishly<span>.</span></button>
        <div className="wish-nav-actions">
          {details.music && (
            <button type="button" className={linkedMusicSelected ? 'icon-button music-url-button' : 'icon-button'} onClick={musicOn ? stopMelody : startMelody} aria-label={musicOn ? `Turn ${selectedMusicLabel} off` : `Play ${selectedMusicLabel}`} title={selectedMusicLabel}>
              {musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              {linkedMusicSelected && <span>{musicOn ? 'Pause music' : 'Play music'}</span>}
            </button>
          )}
          <button type="button" className="copy-link" onClick={copyWishLink} disabled={shareBusy}><Copy size={15} /> {shareBusy ? 'Preparing...' : 'Copy link'}</button>
          <button type="button" className="whatsapp-link" onClick={() => shareOnWhatsApp()} disabled={shareBusy}><MessageCircle size={15} /> WhatsApp</button>
          <button type="button" className="share-link" onClick={shareWish} disabled={shareBusy}><Share2 size={15} /> Share wish</button>
          <button type="button" className="edit-link" onClick={onEdit}><Pencil size={15} /> Edit wish</button>
        </div>
      </nav>

      <div className="wish-layout shell">
        <section className="wish-copy">
          <div className="wish-kicker"><span /> {profile.kicker} <span /></div>
          <p className="wish-script">Happy Birthday</p>
          <h1 aria-label={`Happy Birthday ${details.name}`}>{details.name}<em>!</em></h1>
          {(details.age || formattedBirthdayDate) && (
            <div className="wish-personal-details">
              {details.age && <span>Celebrating {details.age} wonderful years</span>}
              {details.age && formattedBirthdayDate && <i />}
              {formattedBirthdayDate && <span>{formattedBirthdayDate}</span>}
            </div>
          )}
          <div className="heart-rule"><i /><Heart size={17} fill="currentColor" /><i /></div>
          <div className="wish-message-card">
            <Heart className="message-card-heart" size={16} fill="currentColor" aria-hidden="true" />
            <p className="typed-message">“{typedMessage}<span className="typing-caret" />”</p>
            <p className="wish-from">From: <strong>{details.fromName || 'Someone who loves you'}</strong></p>
          </div>
          <p className="relationship-note">{profile.note}</p>
          <div className="wish-actions">
            <button className="button button-primary" type="button" onClick={() => setShowSurprise(true)} data-testid="surprise-button">Click for a surprise <Sparkles size={17} /></button>
            <button className="button replay-button" type="button" onClick={replay}><Play size={16} fill="currentColor" /> Replay magic</button>
          </div>
        </section>

        <section className={photos.length ? 'celebration-art has-photo' : 'celebration-art'} aria-label={`Birthday celebration for ${details.name}`}>
          <div className="scene-media">
            <img
              className="scene-photo-blur"
              key={`blur-${sceneImage.slice(0, 28)}`}
              src={sceneImage}
              alt=""
              aria-hidden="true"
              onError={(event) => {
                if (!event.currentTarget.src.endsWith('/default-photo-realistic.png')) {
                  event.currentTarget.src = '/default-photo-realistic.png'
                }
              }}
            />
            <div className="scene-photo-stage">
              <img
                className="scene-photo"
                key={`photo-${sceneImage.slice(0, 28)}`}
                src={sceneImage}
                alt={featuredPhoto ? `${details.name}'s featured birthday photo` : 'Birthday portrait'}
                onError={(event) => {
                  if (!event.currentTarget.src.endsWith('/default-photo-realistic.png')) {
                    event.currentTarget.src = '/default-photo-realistic.png'
                  }
                }}
              />
            </div>
          </div>
          <div className="scene-lights" aria-hidden="true"><i /><i /><i /></div>
          <div className="wish-floating-hearts" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => <span key={index} style={{ '--heart-index': index }}>♥</span>)}
          </div>
          <div className="animated-cake" aria-label="Animated birthday cake" role="img">
            <span className="cake-flame" />
            <span className="cake-candle" />
            <span className="cake-icing"><i /><i /><i /></span>
            <span className="cake-layer"><b>♡</b></span>
            <span className="cake-plate" />
          </div>
          <div className="scene-shade" />
          <div className="scene-label"><span>YOUR DAY</span><strong>{profile.scene}</strong></div>
          <div className="scene-credit"><i /> {details.fromName ? `WITH LOVE, ${details.fromName.toUpperCase()}` : 'WITH ALL MY LOVE'}</div>
        </section>
        <a className="scroll-invitation" href="#birthday-blessings"><span>THERE’S MORE FOR YOU</span><ArrowDown size={14} /></a>
      </div>

      {galleryPhotos.length > 0 && (
        <section className="memories-section" aria-labelledby="memories-title">
          <div className="memories-heading shell">
            <div className="eyebrow"><Sparkles size={14} /> MOMENTS WORTH KEEPING</div>
            <h2 id="memories-title">Our little gallery of <em>memories.</em></h2>
            <p>Every picture holds a piece of the story.</p>
          </div>
          <div className="memories-grid shell">
            {galleryPhotos.map((photo, index) => (
              <figure className="memory-card" key={`${photo.slice(0, 36)}-${index}`}>
                <img src={photo} alt={`${details.name}'s memory ${index + 1}`} loading="lazy" />
                <figcaption><span>MEMORY</span><strong>{String(index + 1).padStart(2, '0')}</strong></figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="wish-keepsake" id="birthday-blessings">
        <div className="keepsake-heading shell">
          <div className="eyebrow"><Sparkles size={14} /> A FEW WISHES FOR YOUR NEW CHAPTER</div>
          <h2>May this year bring you…</h2>
          <p>All the little things your beautiful heart deserves.</p>
        </div>
        <div className="blessing-grid shell">
          {highlights.map((highlight, index) => (
            <article className="blessing-card" key={highlight.title}>
              <span className="blessing-number">0{index + 1}</span>
              <span className="blessing-icon">{highlight.icon}</span>
              <h3>{highlight.title}</h3>
              <p>{highlight.text}</p>
              <i />
            </article>
          ))}
        </div>

        <div className="keepsake-note no-photo shell">
          <div className="note-decoration" aria-hidden="true"><span>✦</span><span>♡</span></div>
          <div className="note-copy">
            <p className="note-overline">A LITTLE NOTE TO KEEP</p>
            <blockquote>“{profile.keepsake}”</blockquote>
            <p>Never forget how many ordinary days you make brighter just by being yourself, {details.name}.</p>
            <span className="note-signature">{details.fromName ? `With love, ${details.fromName}` : 'Always cheering for you'} ♡</span>
          </div>
        </div>
      </section>

      <section className="wish-closing">
        <div className="closing-stars" aria-hidden="true"><span>✦</span><span>✧</span><span>♡</span><span>✦</span></div>
        <div className="closing-content shell">
          <span className="closing-kicker">ONE MORE TRIP AROUND THE SUN</span>
          <h2>Here’s to all the magic<br /><em>still to come.</em></h2>
          <p>Happy birthday, {details.name}. {profile.closing}</p>
          <div className="closing-actions">
            <button className="button closing-share" type="button" onClick={shareWish} disabled={shareBusy}><Share2 size={17} /> {shareBusy ? 'Preparing link...' : 'Share this wish'}</button>
            <button className="button closing-replay" type="button" onClick={replay}><Play size={15} fill="currentColor" /> Watch again</button>
          </div>
          <div className="closing-heart"><i /><Heart size={18} fill="currentColor" /><i /></div>
        </div>
      </section>

      <footer className="wish-footer"><button type="button" onClick={onHome}><ArrowLeft size={14} /> Make another wish</button><CopyrightMark /></footer>
      {generatedLink && (
        <aside className="share-result" aria-label="Your share link">
          <div className="share-result-heading"><span><Check size={15} /> Share link ready</span><button type="button" onClick={() => setGeneratedLink('')} aria-label="Close share link"><X size={15} /></button></div>
          <div className="share-result-row">
            <input value={generatedLink} readOnly onFocus={(event) => event.target.select()} aria-label="Generated wish link" />
            <button type="button" onClick={() => copyGeneratedLink()}><Copy size={15} /> Copy</button>
            <button className="whatsapp-now" type="button" onClick={() => shareOnWhatsApp()}><MessageCircle size={15} /> WhatsApp</button>
            <button className="share-now" type="button" onClick={() => shareGeneratedLink()}><Share2 size={15} /> Share</button>
            <a href={generatedLink} target="_blank" rel="noreferrer" aria-label="Open wish link"><ExternalLink size={15} /></a>
          </div>
        </aside>
      )}
      {shareStatus && <div className="share-toast" role="status"><Check size={15} /> {shareStatus}</div>}
      {showSurprise && <SurprisePopup name={details.name} relationship={details.relationship} onClose={() => setShowSurprise(false)} />}
    </div>
  )
}

export default BirthdayWish
