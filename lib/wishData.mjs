const relationships = new Set(['Love', 'Friend', 'Family', 'Sister', 'Brother', 'Wife', 'Husband'])
const colors = new Set(['rose-sunset', 'violet-dream', 'golden-hour', 'ocean-mint', 'blue-skies', 'berry-night', 'peach-glow', 'forest-gold', 'midnight-aurora', 'lavender-rose'])
const musicTypes = new Set(['birthday', 'custom', 'link'])

const isShareableAsset = (value, kind) => {
  if (typeof value !== 'string') return false
  if (value.startsWith(`data:${kind}/`)) return true
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const cleanText = (value, maximum) => typeof value === 'string' ? value.trim().slice(0, maximum) : ''

export const isWishId = (value) => typeof value === 'string' && /^[A-Za-z0-9_-]{8}$/.test(value)

export const sanitizeWish = (source) => {
  if (!source || typeof source !== 'object') return null

  const name = cleanText(source.name, 80)
  const fromName = cleanText(source.fromName, 80)
  const parsedAge = Number.parseInt(source.age, 10)
  const age = Number.isInteger(parsedAge) && parsedAge >= 1 && parsedAge <= 130 ? parsedAge : null
  const birthdayDate = /^\d{4}-\d{2}-\d{2}$/.test(source.birthdayDate || '') ? source.birthdayDate : ''
  const message = cleanText(source.message, 320)
  const images = Array.isArray(source.images)
    ? source.images.filter((image) => isShareableAsset(image, 'image')).slice(0, 12)
    : []

  if (!name || !message || !images.length) return null

  const musicType = musicTypes.has(source.musicType) ? source.musicType : 'birthday'
  const wish = {
    name,
    age,
    fromName,
    birthdayDate,
    relationship: relationships.has(source.relationship) ? source.relationship : 'Love',
    image: images[0],
    images,
    message,
    color: colors.has(source.color) ? source.color : 'rose-sunset',
    music: Boolean(source.music),
    musicType,
    musicSrc: '',
    musicName: cleanText(source.musicName, 120),
    musicUrl: '',
  }

  if (musicType === 'custom' && isShareableAsset(source.musicSrc, 'audio')) wish.musicSrc = source.musicSrc
  if (musicType === 'link' && isShareableAsset(source.musicUrl, 'audio')) wish.musicUrl = source.musicUrl

  return wish
}
