const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const DayJSUtc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

const connection = require('../db/connection')

dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(DayJSUtc)
dayjs.tz.setDefault('Asia/Kuala_Lumpur')

exports.getIndex = async (req, res) => {
  let { publisher: selected_pub, language } = req.query
  try {
    const db = await connection()

    const find = {}
    selected_pub = selected_pub ? selected_pub : 'All'
    if (selected_pub !== 'All') find.publisher = selected_pub
    if (language) find.language = language

    const publishers = await db.collection('publishers').find({}).toArray()
    publishers.unshift({ publisher: 'All' })
    const entries = await db
      .collection('entries')
      .find(find)
      .sort({ published_date: -1 })
      .limit(30)
      .toArray()
    res.render('index', { publishers, entries, dayjs, selected_pub, language })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
}
