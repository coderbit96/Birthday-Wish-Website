import { useEffect, useState } from 'react'
import Home from './components/Home'
import BirthdayForm from './components/BirthdayForm'
import BirthdayWish from './components/BirthdayWish'

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
  const [shareId, setShareId] = useState(sharedWishId)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!sharedWishId) return

    const loadSharedWish = async () => {
      try {
        const response = await fetch(`/api/wishes/${sharedWishId}`)
        if (!response.ok) throw new Error('Wish not found')
        const sharedWish = await response.json()
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
    const cleanUrl = `${window.location.pathname}${window.location.search}`
    window.history.replaceState({}, '', cleanUrl)
  }

  const createWish = (details) => {
    clearSharedUrl()
    setWish(details)
    setScreen('wish')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const createShareLink = async () => {
    let id = shareId
    if (!id) {
      const shareableWish = getShareableWish(wish)

      if (localHosts.has(window.location.hostname)) {
        const response = await fetch('/api/wishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shareableWish),
        })

        const isJson = response.headers.get('content-type')?.includes('application/json')
        const result = isJson ? await response.json() : null
        if (!response.ok) {
          throw new Error(result?.error || 'The sharing server is unavailable. Restart Wishly with npm run dev.')
        }
        if (!result || !/^[A-Za-z0-9_-]{8}$/.test(result.id)) {
          throw new Error('The sharing server is unavailable. Restart Wishly with npm run dev.')
        }
        id = result.id
      } else {
        const { upload } = await import('@vercel/blob/client')
        id = makeWishId()
        const pathname = `wishes/${id}.json`
        const wishBlob = new Blob([JSON.stringify(shareableWish)], { type: 'application/json' })
        const result = await upload(pathname, wishBlob, {
          access: 'public',
          handleUploadUrl: '/api/wishes/upload',
          clientPayload: id,
          multipart: wishBlob.size > 4 * 1024 * 1024,
        })
        if (result.pathname !== pathname) throw new Error('The public wish could not be saved. Please try again.')
      }

      setShareId(id)
    }

    const url = new URL(import.meta.env.BASE_URL, window.location.origin)
    url.hash = `wish=${id}`
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    return url.toString()
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
    <main>
      {screen === 'loading' && <div className="wish-load-state"><span />Opening your birthday wish...</div>}
      {screen === 'error' && (
        <div className="wish-load-state wish-load-error">
          <h1>We couldn’t open this wish.</h1>
          <p>{loadError}</p>
          <button className="button button-primary" type="button" onClick={goHome}>Make a new wish</button>
        </div>
      )}
      {screen === 'home' && <Home onCreate={() => setScreen('form')} />}
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
        />
      )}
    </main>
  )
}

export default App
