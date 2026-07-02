import { useState } from 'react'
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

// Handy during development: open ?preview=wish to jump straight to a sample wish.
const previewParams = new URLSearchParams(window.location.search)
const isWishPreview = import.meta.env.DEV && previewParams.get('preview') === 'wish'
const isFormPreview = import.meta.env.DEV && previewParams.get('preview') === 'form'
const isGalleryPreview = import.meta.env.DEV && previewParams.get('gallery') === '1'
const previewRelationships = ['Love', 'Friend', 'Family', 'Sister', 'Brother', 'Wife', 'Husband']
const requestedRelationship = previewParams.get('relationship')
const previewWish = {
  ...starterWish,
  name: 'Ananya',
  relationship: previewRelationships.includes(requestedRelationship) ? requestedRelationship : 'Love',
  image: isGalleryPreview ? '/default-photo-realistic.png' : '',
  images: isGalleryPreview ? ['/default-photo-realistic.png', '/default-photo.svg'] : [],
  message: 'Every day with you feels like a gift. Today, I hope the whole world reminds you just how deeply you are loved.',
}

function App() {
  const [screen, setScreen] = useState(isWishPreview ? 'wish' : isFormPreview ? 'form' : 'home')
  const [wish, setWish] = useState(isWishPreview || isFormPreview ? previewWish : starterWish)

  const createWish = (details) => {
    setWish(details)
    setScreen('wish')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main>
      {screen === 'home' && <Home onCreate={() => setScreen('form')} />}
      {screen === 'form' && (
        <BirthdayForm
          initialValues={wish}
          onBack={() => setScreen('home')}
          onSubmit={createWish}
        />
      )}
      {screen === 'wish' && (
        <BirthdayWish
          details={wish}
          onEdit={() => setScreen('form')}
          onHome={() => setScreen('home')}
        />
      )}
    </main>
  )
}

export default App
