import { list } from '@vercel/blob'
import { isWishId, sanitizeWish } from '../../lib/wishData.mjs'

export default {
  async fetch(request) {
    const id = new URL(request.url).pathname.split('/').filter(Boolean).at(-1)
    if (request.method !== 'GET' || !isWishId(id)) {
      return Response.json({ error: 'Wish not found.' }, { status: 404 })
    }

    try {
      const pathname = `wishes/${id}.json`
      const { blobs } = await list({ prefix: pathname, limit: 2 })
      const blob = blobs.find((item) => item.pathname === pathname)
      if (!blob) return Response.json({ error: 'Wish not found.' }, { status: 404 })

      const blobResponse = await fetch(blob.url, { cache: 'no-store' })
      if (!blobResponse.ok) throw new Error('The saved wish could not be read.')
      const wish = sanitizeWish(await blobResponse.json())
      if (!wish) return Response.json({ error: 'Wish not found.' }, { status: 404 })

      return Response.json(wish, {
        headers: { 'Cache-Control': 'public, max-age=300' },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wish could not be opened.'
      const missingStore = /BLOB_READ_WRITE_TOKEN|token/i.test(message)
      return Response.json({
        error: missingStore ? 'Public sharing is not configured yet. Connect a Vercel Blob store.' : message,
      }, { status: missingStore ? 503 : 500 })
    }
  },
}
