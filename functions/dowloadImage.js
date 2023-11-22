const fs = require('fs')
const md5 = require('md5')
const axios = require('axios')

const downloadImage = async url => {
  try {
    const response = await axios.get(url, { responseType: 'stream' })
    const file_name = `${md5(url)}.png`
    const outputPath = `./public/${file_name}`
    response.data.pipe(fs.createWriteStream(outputPath))

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve(file_name)
      })

      response.data.on('error', err => {
        reject(err)
      })
    })
  } catch (error) {
    throw new Error(`Error downloading the image: ${error}`)
  }
}

module.exports = downloadImage
