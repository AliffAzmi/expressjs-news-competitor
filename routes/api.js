const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const fetchRssUrl = require('../functions/fetchRssFeed')

const limiter = rateLimit({
  windowMs: 15000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
})

router.use('/fetch-feed', (req, res, next) => {
  const timeoutMs = 15000
  res.setTimeout(timeoutMs, () => {
    console.error('Error: Route execution timed out.')
    res.status(500).json({ error: 'Request Timeout' })
  })
  next()
})

router.get('/fetch-feed', limiter, async (req, res) => {
  const { rss_url } = req.query
  try {
    const payload = await fetchRssUrl(rss_url)
    res.json({ message: 'Ok', payload })
  } catch (error) {
    console.log('Unexpected error: ', error)
  }
})

module.exports = router
