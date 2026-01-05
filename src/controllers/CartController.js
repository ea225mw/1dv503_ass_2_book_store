import {dbPool} from '../config/database.js'

export class CartController {
  constructor() {
    this.updateCart = this.updateCart.bind(this)
    this.getCart = this.getCart.bind(this)
  }

  async updateCart(req, res, next) {
    const {isbn, quantity} = req.body
    const userID = Number(req.session.userID)

    const [result] = await dbPool.execute('INSERT INTO `cart` (`userid`, `isbn`, `qty`) VALUES (?, ?, ?)', [
      userID,
      isbn,
      Number(quantity),
    ])

    const cart = await this.getCart(userID)
    res.json(cart)
  }

  async getCart(userID) {
    const [rows] = await dbPool.execute(
      `
      SELECT b.isbn, b.title, b.price, c.qty 
      FROM books b
      JOIN cart c ON b.isbn = c.isbn
      WHERE c.userid = ?`,
      [userID]
    )
    return rows
  }
}
