import express from 'express'
import {RegisterController} from '../controllers/RegisterController.js'

export const router = express.Router()

const controller = new RegisterController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.post('/', (req, res, next) => controller.registerNewMember(req, res, next))
