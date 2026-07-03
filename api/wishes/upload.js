import { handleUpload } from '@vercel/blob/client'
import { isWishId } from '../../lib/wishData.mjs'

const getCorsHeaders = (request) => {
  const origin = request.headers.get('origin') || ''
  const isLocalWishly = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  const isPublicWishly = origin === 'https://birthday-wish-website-pi.vercel.app'
  if (!isLocalWishly && !isPublicWishly) return {}

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-version',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

export default {
  async fetch(request) {
    const corsHeaders = getCorsHeaders(request)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders })

    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed.' }, { status: 405, headers: corsHeaders })
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

      return Response.json(result, { headers: corsHeaders })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wish upload failed.'
      const missingStore = /BLOB_READ_WRITE_TOKEN|token/i.test(message)
      return Response.json({
        error: missingStore ? 'Public sharing is not configured yet. Connect a Vercel Blob store.' : message,
      }, { status: missingStore ? 503 : 400, headers: corsHeaders })
    }
  },
}
