import {dbPool} from '../config/database.js'
import {getCart} from '../middlewares/cartMiddleware.js'

export class CartController {
  constructor() {
    this.updateCart = this.updateCart.bind(this)
  }

  async updateCart(req, res, next) {
    try {
      const {isbn, quantity} = req.body
      const userID = Number(req.session.userID)

      await dbPool.execute(
        `
        INSERT INTO cart (userid, isbn, qty)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)
        `,
        [userID, isbn, quantity]
      )

      const cart = await getCart(userID)

      res.json(cart)
    } catch (error) {
      next(error)
    }
  }
}
