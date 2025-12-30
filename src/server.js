import express from 'express'
import session from 'express-session'
import mysql from 'mysql2/promise'

import {router} from './routes/router.js'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {sessionOptions} from './config/sessionOptions.js'

const app = express()

const directoryFullName = dirname(fileURLToPath(import.meta.url))
const baseURL = process.env.BASE_URL || '/'

app.set('view engine', 'ejs')
app.set('views', join(directoryFullName, 'views'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(join(directoryFullName, '..', 'public')))

app.use(session(sessionOptions))

app.use((req, res, next) => {
  res.locals.baseURL = baseURL
  res.locals.loggedIn = Boolean(req.session.userID)
  next()
})

app.use('/', router)

const server = app.listen(process.env.PORT, () => {
  console.log('PORT: ', process.env.PORT)
  console.log(`Server running at http://localhost:${server.address().port}`)
  console.log('Press Ctrl-C to terminate...')
})
