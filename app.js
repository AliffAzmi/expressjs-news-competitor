const express = require('express')
const path = require('path')

const routes = require('./routes/index')
const routesAPI = require('./routes/api')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes)
app.use('/api', routesAPI)

const server = app.listen(3000, () => {
  console.log(`The app rock on port ${server.address().port}!`)
})
