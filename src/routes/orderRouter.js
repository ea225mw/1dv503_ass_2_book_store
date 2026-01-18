import express from 'express'
import {OrderController} from '../controllers/OrderController.js'

export const router = express.Router()

const controller = new OrderController()

router.param('id', (req, res, next, id) => controller.getInvoice(req, res, next, id))
router.get('/:id/invoice', controller.index)

router.get('/', controller.index)
router.post('/', controller.placeOrder)
