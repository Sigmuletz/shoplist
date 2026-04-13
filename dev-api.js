// Local dev server for API routes — mirrors Vercel serverless behavior
// Run with: node --env-file=.env.local dev-api.js
// Vite proxies /api/* to this server (port 3001)

import http from 'http'
import handler from './api/send-telegram.js'

const PORT = 3001

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/api/')) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  // Buffer body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const body = Buffer.concat(chunks).toString()

  // Build req/res shim compatible with the Vercel handler signature
  const mockReq = {
    method: req.method,
    headers: req.headers,
    body: body ? JSON.parse(body) : {},
    url: req.url,
  }

  const mockRes = {
    statusCode: 200,
    _headers: {},
    status(code) { this.statusCode = code; return this },
    setHeader(k, v) { this._headers[k] = v },
    json(data) {
      res.writeHead(this.statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...this._headers,
      })
      res.end(JSON.stringify(data))
    },
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' })
    res.end()
    return
  }

  try {
    await handler(mockReq, mockRes)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: false, error: err.message }))
  }
})

server.listen(PORT, () => {
  console.log(`Dev API server running on http://localhost:${PORT}`)
})
