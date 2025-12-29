import express from 'express'
import {router} from './routes/router.js'

const app = express()

app.use('/', router)

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${server.address().port}`)
  console.log('Press Ctrl-C to terminate...')
})
