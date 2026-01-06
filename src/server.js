import express from 'express'
import session from 'express-session'
import expressLayouts from 'express-ejs-layouts'

import {router} from './routes/router.js'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {sessionOptions} from './config/sessionOptions.js'

const app = express()

const directoryFullName = dirname(fileURLToPath(import.meta.url))
const baseURL = process.env.BASE_URL || '/'

app.set('view engine', 'ejs')
app.set('views', join(directoryFullName, 'views'))
app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)
app.use(expressLayouts)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(join(directoryFullName, '..', 'public')))

app.use(session(sessionOptions))

app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  res.locals.baseURL = baseURL
  res.locals.loggedIn = Boolean(req.session.userID)
  res.locals.currentUserName = req.session.currentUserName
  next()
})

app.use('/', router)

const server = app.listen(process.env.PORT, () => {
  console.log('PORT: ', process.env.PORT)
  console.log(`Server running at http://localhost:${server.address().port}`)
  console.log('Press Ctrl-C to terminate...')
})
