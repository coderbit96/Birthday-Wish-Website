const bytesToBase64Url = (bytes) => {
  let binary = ''
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const base64UrlToBytes = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = window.atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

export async function encodeWishPayload(wish) {
  const json = JSON.stringify(wish)
  const input = new TextEncoder().encode(json)

  if ('CompressionStream' in window) {
    const compressed = new Blob([input]).stream().pipeThrough(new CompressionStream('gzip'))
    const bytes = new Uint8Array(await new Response(compressed).arrayBuffer())
    return `g.${bytesToBase64Url(bytes)}`
  }

  return `j.${bytesToBase64Url(input)}`
}

export async function decodeWishPayload(payload) {
  const [format, encoded] = [payload.slice(0, 1), payload.slice(2)]
  if (!encoded || !['g', 'j'].includes(format)) throw new Error('Invalid wish link')

  let bytes = base64UrlToBytes(encoded)
  if (format === 'g') {
    if (!('DecompressionStream' in window)) throw new Error('This browser cannot open compressed wish links')
    const decompressed = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
    bytes = new Uint8Array(await new Response(decompressed).arrayBuffer())
  }

  return JSON.parse(new TextDecoder().decode(bytes))
}
