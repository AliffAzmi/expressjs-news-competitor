const { MongoClient } = require('mongodb')
const connectionString = 'mongodb://localhost:27017'

const client = new MongoClient(connectionString)

async function connection () {
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    const db = client.db('competitor')
    return db
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

module.exports = connection
