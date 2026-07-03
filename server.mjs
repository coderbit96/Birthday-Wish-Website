import crypto from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { isWishId, sanitizeWish } from './lib/wishData.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.join(root, '.wish-data')
const production = process.argv.includes('--production')
const port = Number(process.env.PORT) || 5173

await mkdir(dataDirectory, { recursive: true })

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '40mb' }))

app.post('/api/wishes', async (request, response) => {
  const wish = sanitizeWish(request.body)
  if (!wish) {
    response.status(400).json({ error: 'The wish is incomplete or contains unsupported media.' })
    return
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = crypto.randomBytes(6).toString('base64url').slice(0, 8)
    try {
      await writeFile(path.join(dataDirectory, `${id}.json`), JSON.stringify(wish), { flag: 'wx' })
      response.status(201).json({ id })
      return
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }
  }

  response.status(503).json({ error: 'A link could not be created. Please try again.' })
})

app.get('/api/wishes/:id', async (request, response) => {
  if (!isWishId(request.params.id)) {
    response.status(404).json({ error: 'Wish not found.' })
    return
  }

  try {
    const wish = await readFile(path.join(dataDirectory, `${request.params.id}.json`), 'utf8')
    response.set('Cache-Control', 'public, max-age=300')
    response.type('json').send(wish)
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.status(404).json({ error: 'Wish not found.' })
      return
    }
    throw error
  }
})

if (production) {
  const distDirectory = path.join(root, 'dist')
  app.use(express.static(distDirectory))
  app.use((request, response, next) => {
    if (request.method !== 'GET') return next()
    response.sendFile(path.join(distDirectory, 'index.html'))
  })
} else {
  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({ root, server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error)
  const tooLarge = error.type === 'entity.too.large'
  response.status(tooLarge ? 413 : 500).json({
    error: tooLarge ? 'This wish has too much media to share in one link.' : 'Something went wrong while saving the wish.',
  })
})

app.listen(port, () => {
  console.log(`Wishly is running at http://localhost:${port}`)
})
