import { useEffect, useState } from 'react'
import Home from './components/Home'
import BirthdayForm from './components/BirthdayForm'
import BirthdayWish from './components/BirthdayWish'
import CelebrationBackground from './components/CelebrationBackground'
import CursorBackground from './components/CursorBackground'
import { getColorTheme } from './themeOptions'

const starterWish = {
  name: '',
  relationship: 'Love',
  image: '',
  images: [],
  message: '',
  color: 'rose-sunset',
  music: true,
  musicType: 'birthday',
  musicSrc: '',
  musicName: '',
  musicUrl: '',
}

const sharedWishId = window.location.hash.match(/^#wish=([A-Za-z0-9_-]{8})$/)?.[1] || ''
const localHosts = new Set(['localhost', '127.0.0.1', '::1'])
const publicSiteOrigin = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://birthday-wish-website-pi.vercel.app').replace(/\/$/, '')

const makeWishId = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  const bytes = window.crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

const getShareableWish = (wish) => ({
  name: wish.name,
  relationship: wish.relationship,
  image: wish.image,
  images: wish.images,
  message: wish.message,
  color: wish.color,
  music: wish.music,
  musicType: wish.musicType,
  musicSrc: wish.musicSrc,
  musicName: wish.musicName,
  musicUrl: wish.musicUrl,
})

function App() {
  const [screen, setScreen] = useState(sharedWishId ? 'loading' : 'home')
  const [wish, setWish] = useState(starterWish)
  const [shareId, setShareId] = useState(localHosts.has(window.location.hostname) ? '' : sharedWishId)
  const [shareLink, setShareLink] = useState('')
  const [loadError, setLoadError] = useState('')
  const [celebrationKey, setCelebrationKey] = useState(0)
  const celebrationTheme = getColorTheme(wish.color)

  useEffect(() => {
    if (!sharedWishId) return

    const loadSharedWish = async () => {
      try {
        const response = await fetch(`/api/wishes/${sharedWishId}`)
        if (!response.ok) throw new Error('Wish not found')
        const sharedWish = await response.json()
        if (!sharedWish?.name || !sharedWish?.message || !Array.isArray(sharedWish?.images)) {
          throw new Error('Invalid wish')
        }
        setWish({ ...starterWish, ...sharedWish })
        setScreen('wish')
      } catch {
        setLoadError('This wish link is unavailable or has expired.')
        setScreen('error')
      }
    }

    loadSharedWish()
  }, [])

  const clearSharedUrl = () => {
    setShareId('')
    setShareLink('')
    const cleanUrl = `${window.location.pathname}${window.location.search}`
    window.history.replaceState({}, '', cleanUrl)
  }

  const createWish = (details) => {
    clearSharedUrl()
    setWish(details)
    setCelebrationKey((key) => key + 1)
    setScreen('wish')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const createShareLink = async () => {
    if (shareLink) return shareLink

    let id = shareId
    if (!id) {
      const shareableWish = getShareableWish(wish)
      const sharingOrigin = localHosts.has(window.location.hostname) ? publicSiteOrigin : window.location.origin
      const { upload } = await import('@vercel/blob/client')
      id = makeWishId()
      const pathname = `wishes/${id}.json`
      const wishBlob = new Blob([JSON.stringify(shareableWish)], { type: 'application/json' })
      let result
      try {
        result = await upload(pathname, wishBlob, {
          access: 'public',
          handleUploadUrl: `${sharingOrigin}/api/wishes/upload`,
          clientPayload: id,
          multipart: wishBlob.size > 4 * 1024 * 1024,
        })
      } catch (error) {
        throw new Error('The public wish could not be saved. Please try again.', { cause: error })
      }
      if (result.pathname !== pathname) throw new Error('The public wish could not be saved. Please try again.')

      setShareId(id)
    }

    const linkOrigin = localHosts.has(window.location.hostname) ? publicSiteOrigin : window.location.origin
    const url = new URL(import.meta.env.BASE_URL, linkOrigin)
    url.hash = `wish=${id}`
    if (!localHosts.has(window.location.hostname)) {
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
    const generatedLink = url.toString()
    setShareLink(generatedLink)
    return generatedLink
  }

  const goHome = () => {
    clearSharedUrl()
    setScreen('home')
  }

  const editWish = () => {
    clearSharedUrl()
    setScreen('form')
  }

  return (
    <main
      style={{
        '--theme-accent': celebrationTheme.accent,
        '--theme-secondary': celebrationTheme.secondary,
        '--theme-ink': celebrationTheme.ink,
      }}
    >
      <CelebrationBackground
        replayKey={`${screen}-${celebrationKey}`}
        palette={[celebrationTheme.accent, celebrationTheme.secondary, '#efc46b', celebrationTheme.ink]}
      />
      <CursorBackground />
      {screen === 'loading' && <div className="wish-load-state"><span />Opening your birthday wish...</div>}
      {screen === 'error' && (
        <div className="wish-load-state wish-load-error">
          <h1>We couldn’t open this wish.</h1>
          <p>{loadError}</p>
          <button className="button button-primary" type="button" onClick={goHome}>Make a new wish</button>
        </div>
      )}
      {screen === 'home' && <Home onCreate={() => { setCelebrationKey((key) => key + 1); setScreen('form') }} />}
      {screen === 'form' && (
        <BirthdayForm
          initialValues={wish}
          onBack={goHome}
          onSubmit={createWish}
        />
      )}
      {screen === 'wish' && (
        <BirthdayWish
          details={wish}
          onEdit={editWish}
          onHome={goHome}
          createShareLink={createShareLink}
          onReplayCelebration={() => setCelebrationKey((key) => key + 1)}
        />
      )}
    </main>
  )
}

export default App
