import express from 'express'
import {OrderController} from '../controllers/OrderController.js'

export const router = express.Router()

const controller = new OrderController()

router.get('/', controller.index)
router.post('/', controller.placeOrder)
router.post('/getinvoice', controller.searchForOrder)
