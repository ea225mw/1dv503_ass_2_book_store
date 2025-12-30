import express from 'express'
import {LogoutController} from '../controllers/LogoutController.js'

export const router = express.Router()

const controller = new LogoutController()

router.get('/', (req, res, next) => controller.index(req, res, next))
