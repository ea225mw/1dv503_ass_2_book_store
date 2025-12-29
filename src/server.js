import express from 'express'
import {router} from './routes/router.js'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const app = express()

const directoryFullName = dirname(fileURLToPath(import.meta.url))
const baseURL = process.env.BASE_URL || '/'

app.set('view engine', 'ejs')
app.set('views', join(directoryFullName, 'views'))

app.use(express.urlencoded({extended: false}))

app.use(express.static(join(directoryFullName, '..', 'public')))

app.use((req, res, next) => {
  res.locals.baseURL = baseURL
  next()
})

app.use('/', router)

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${server.address().port}`)
  console.log('Press Ctrl-C to terminate...')
})
