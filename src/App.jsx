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
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wish),
      })

      if (!response.ok) throw new Error('Could not save wish')
      const result = await response.json()
      id = result.id
      setShareId(id)
    }

    const url = new URL(import.meta.env.BASE_URL, window.location.origin)
    url.hash = `wish=${id}`
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
