import express from 'express'
import {router as homeRouter} from './homeRouter.js'
import {router as registerRouter} from './registerRouter.js'
import {router as loginRouter} from './loginRouter.js'
import {router as logoutRouter} from './logoutRouter.js'
import {router as booksRouter} from './booksRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/register', registerRouter)
router.use('/login', loginRouter)
router.use('/logout', logoutRouter)
router.use('/books', booksRouter)
