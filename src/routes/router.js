import express from 'express'
import {router as homeRouter} from './homeRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
