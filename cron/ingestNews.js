const cron = require('node-cron')

const connection = require('../db/connection')

cron.schedule('0 * * * *', async () => {
  try {
    connection()
      .then(async db => {
        const publishers = await db
          .collection('publishers')
          .find({})
          .project({ rss_url: 1, publisher: 1 })
          .toArray()

        for (const pub of publishers) {
          const { rss_url, publisher } = pub

          try {
            const response = await fetch(
              `http://localhost:3000/api/fetch-feed?rss_url=${encodeURIComponent(
                rss_url
              )}`
            )
            const data = await response.json()

            if (data?.payload) {
              for (const item of data.payload) {
                const filter = { title: item.title }
                const update = { $set: { publisher, ...item } }
                const options = { upsert: true }

                await db
                  .collection('entries')
                  .updateOne(filter, update, options)
              }
              console.log(
                `Fetched and store data for publisher ${publisher} - data length: ${data?.payload.length}`
              )
            } else {
              console.log('Undefined payload')
            }
          } catch (error) {
            console.log(error)
          }
        }
      })
      .catch(err => console.error(err))
  } catch (error) {
    console.log(error)
  }
})
