import express from 'express'
import {LoginController} from '../controllers/LoginController.js'

export const router = express.Router()

const controller = new LoginController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.post('/', (req, res, next) => controller.logUserIn(req, res, next))
