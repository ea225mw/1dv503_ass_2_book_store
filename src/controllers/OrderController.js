import {getCart} from '../middlewares/cartMiddleware.js'
import {dbPool} from '../config/database.js'

export class OrderController {
  constructor() {
    this.placeOrder = this.placeOrder.bind(this)
    this.writeToOrders = this.writeToOrders.bind(this)
    this.index = this.index.bind(this)
  }

  async index(req, res, next) {
    const userID = Number(req.session.userID)
    const allOrders = await this.getUsersOrders(userID)
    allOrders.forEach((order) => {
      order.created = order.created.toISOString().slice(0, 10)
    })
    res.render('orders', {allOrders: allOrders, invoice: null})
  }

  async getUsersOrders(userID) {
    const [allOrders] = await dbPool.execute(`SELECT * FROM orders WHERE userid = ?`, [userID])
    return allOrders
  }

  async placeOrder(req, res, next) {
    const userID = Number(req.session.userID)
    const cart = await getCart(userID)

    const orderNumber = await this.writeToOrders(userID)
    await this.writeToOrderDetails(orderNumber, cart)
    const allOrders = await this.getUsersOrders(userID)

    const invoice = await this.createInvoice(orderNumber)
    await this.emptyUsersCart(userID)

    console.log('Invoice: ', invoice)

    res.render('orders', {allOrders: allOrders, invoice: invoice})
  }

  async writeToOrders(userID) {
    const createdDate = new Date().toISOString().slice(0, 10)

    const member = await this.getMember(userID)

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

  async getMember(userID) {
    const [userInfo] = await dbPool.execute(`SELECT * FROM members WHERE userid = ?`, [userID])
    return userInfo[0]
  }

  async emptyUsersCart(userID) {
    await dbPool.execute(`DELETE FROM cart WHERE userid = ?`, [userID])
  }

  async createInvoice(orderNumber) {
    const [allOrderDetails] = await dbPool.execute(
      `
      SELECT od.ono, od.isbn, b.title, ROUND(b.price, 2) as price, od.qty, od.amount, o.created, m.fname, m.lname, o.shipAddress, o.shipCity, o.shipZip,
      SUM(od.amount) OVER (PARTITION BY od.ono) AS orderTotal 
      FROM odetails od
      JOIN orders o ON od.ono = o.ono
      JOIN books b ON od.isbn = b.isbn
      JOIN members m ON o.userid = m.userid
      WHERE od.ono = ?`,
      [orderNumber]
    )

    console.log(allOrderDetails)

    let invoiceData = {
      orderNumber: allOrderDetails[0].ono,
      created: allOrderDetails[0].created,
      fname: allOrderDetails[0].fname,
      lname: allOrderDetails[0].lname,
      street: allOrderDetails[0].shipAddress,
      city: allOrderDetails[0].shipCity,
      zip: allOrderDetails[0].shipZip,
      lineItems: [],
      orderTotal: allOrderDetails[0].orderTotal,
    }

    allOrderDetails.forEach((lineItem) => {
      const {isbn, title, qty, price, amount} = lineItem
      invoiceData.lineItems.push({
        isbn: isbn,
        title: title,
        qty: qty,
        price: price,
        amount: amount,
      })
    })

    return invoiceData
  }
}
