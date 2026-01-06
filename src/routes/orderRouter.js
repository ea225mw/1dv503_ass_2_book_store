import express from 'express'
import {OrderController} from '../controllers/OrderController.js'

export const router = express.Router()

const controller = new OrderController()

router.post('/', controller.placeOrder)
