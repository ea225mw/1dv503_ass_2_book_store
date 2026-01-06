import {dbPool} from '../config/database.js'
import {getCart} from '../middlewares/cartMiddleware.js'

export class CartController {
  constructor() {
    this.updateCart = this.updateCart.bind(this)
  }

  async updateCart(req, res, next) {
    const {isbn, quantity} = req.body
    const userID = Number(req.session.userID)

    const [result] = await dbPool.execute('INSERT INTO `cart` (`userid`, `isbn`, `qty`) VALUES (?, ?, ?)', [
      userID,
      isbn,
      Number(quantity),
    ])

    const cart = await getCart(userID)

    res.json(cart)
  }
}
