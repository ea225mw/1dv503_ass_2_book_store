import express from 'express'
import {BooksController} from '../controllers/BooksController.js'

export const router = express.Router()

const controller = new BooksController()

router.get('/', controller.index)
router.post('/', controller.search)
