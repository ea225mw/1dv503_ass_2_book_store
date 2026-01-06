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

    await this.writeToOrders(userID)
    // await this.writeToOrderDetails(cart)
  }

  async writeToOrders(userID) {
    // console.log(typeof userID)
    const createdDate = new Date().toISOString().slice(0, 10)

    const [userData] = await dbPool.execute(`SELECT * FROM members WHERE userid = ?`, [userID])
    const member = userData[0]

    console.log(userID, createdDate, member.address, member.city, member.zip)

    await dbPool.execute(
      `INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip) VALUES (?, ?, ?, ?, ?)`,
      [userID, createdDate, member.address, member.city, member.zip]
    )
  }

  async writeToOrderDetails(cart) {
    cart.forEach(async (book) => {
      await dbPool.execute()
    })
  }
}
