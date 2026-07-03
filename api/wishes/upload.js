import { handleUpload } from '@vercel/blob/client'
import { isWishId } from '../../lib/wishData.mjs'

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed.' }, { status: 405 })
    }

    try {
      const body = await request.json()
      const result = await handleUpload({
        request,
        body,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          const id = clientPayload || ''
          if (!isWishId(id) || pathname !== `wishes/${id}.json`) {
            throw new Error('Invalid wish upload.')
          }

          return {
            allowedContentTypes: ['application/json'],
            maximumSizeInBytes: 40 * 1024 * 1024,
            addRandomSuffix: false,
            allowOverwrite: false,
            cacheControlMaxAge: 300,
            validUntil: Date.now() + 5 * 60 * 1000,
            tokenPayload: id,
          }
        },
        onUploadCompleted: async () => {},
      })

      return Response.json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wish upload failed.'
      const missingStore = /BLOB_READ_WRITE_TOKEN|token/i.test(message)
      return Response.json({
        error: missingStore ? 'Public sharing is not configured yet. Connect a Vercel Blob store.' : message,
      }, { status: missingStore ? 503 : 400 })
    }
  },
}
