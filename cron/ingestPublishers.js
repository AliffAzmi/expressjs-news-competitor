const connection = require('../db/connection')

const publishers = [
  {
    publisher: 'Berita Harian',
    base_url: 'https://www.bharian.com.my',
    rss_url: 'https://www.bharian.com.my/feed'
  },
  {
    publisher: 'SAYS',
    base_url: 'https://says.com/my',
    rss_url: 'https://says.com/my/rss'
  },
  {
    publisher: 'Utusan',
    base_url: 'https://www.utusan.com.my',
    rss_url: 'https://www.utusan.com.my/feed'
  }
]

connection()
  .then(async db => {
    await db.collection('publishers').deleteMany({})
    await db
      .collection('publishers')
      .insertMany(publishers)
      .then(docs =>
        console.log(
          `${publishers.length} publishers have been inserted into the database.`
        )
      )
      .catch(err => {
        console.error(
          `${
            err.writeErrors?.length ?? 0
          } errors occurred during the insertMany operation.`
        )
      })
    process.exit(0)
  })
  .catch(err => console.log(err))
