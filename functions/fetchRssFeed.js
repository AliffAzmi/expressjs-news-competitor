const { detect } = require('langdetect')
const downloadImage = require('./dowloadImage')
const dayjs = require('dayjs')
const DayJSUtc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(DayJSUtc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Kuala_Lumpur')

const Parser = require('rss-parser')

const parser = new Parser({
  headers: { 'User-Agent': 'Chrome' },
  customFields: { item: ['media:content', 'media'] }
})

async function fetchRssUrl (rss_url) {
  const limit = 10
  try {
    let feed = await parser.parseURL(rss_url)
    const payload = Promise.all(
      feed.items
        .slice(0, limit)
        .map(async item => await processItem(item, feed))
    )
    return payload
  } catch (error) {
    console.error('Error fetching or parsing the RSS feed:', error.message)
    return null
  }
}

const processItem = async (item, feed) => {
  return new Promise(async (resolve, reject) => {
    const imgPlaceholder =
      'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'

    let featured_image = imgPlaceholder
    if (item?.['media:content']?.['$']?.url) {
      featured_image = await downloadImage(item['media:content']['$'].url)
    }

    let published_date = item.pubDate
      ? dayjs(item.pubDate.replaceAll('+0000', '+0800')).tz('Asia/Kuala_Lumpur')
      : ''

    let language =
      detect(item.title)[0] && detect(item.title)[0].lang == 'en'
        ? detect(item.title)[0].lang
        : 'my'

    const pl = {
      title: item.title,
      link: item.link,
      published_date: published_date,
      featured_image: featured_image,
      publisher: feed?.title.replaceAll('Utusan Malaysia', 'Utusan'),
      language: language,
      author: item?.author || ''
    }
    resolve(pl)
  })
}

module.exports = fetchRssUrl
