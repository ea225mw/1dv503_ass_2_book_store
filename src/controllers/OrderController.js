import {getCart} from '../middlewares/cartMiddleware.js'
import {dbPool} from '../config/database.js'

export class OrderController {
  constructor() {
    this.placeOrder = this.placeOrder.bind(this)
    this.writeToOrders = this.writeToOrders.bind(this)
  }

  async placeOrder(req, res, next) {
    const userID = Number(req.session.userID)
    const cart = await getCart(userID)

    const orderNumber = await this.writeToOrders(userID)
    await this.writeToOrderDetails(orderNumber, cart)
    // res.render('./orders')
  }

  async writeToOrders(userID) {
    const createdDate = new Date().toISOString().slice(0, 10)

    const [userInfo] = await dbPool.execute(`SELECT * FROM members WHERE userid = ?`, [userID])
    const member = userInfo[0]

    const [result] = await dbPool.execute(
      `INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip) VALUES (?, ?, ?, ?, ?)`,
      [userID, createdDate, member.address, member.city, member.zip]
    )
    return result.insertId // Order number
  }

  async writeToOrderDetails(orderNumber, cart) {
    cart.forEach(async (lineItem) => {
      await dbPool.execute(`INSERT INTO odetails (ono, isbn, qty, amount) VALUES (?, ?, ?, ?)`, [
        orderNumber,
        lineItem.isbn,
        lineItem.qty,
        lineItem.line_total,
      ])
    })
  }

  async emptyUsersCart(userID) {}
}
