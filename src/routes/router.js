import express from 'express'
import {router as homeRouter} from './homeRouter.js'
import {router as registerRouter} from './registerRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/register', registerRouter)
