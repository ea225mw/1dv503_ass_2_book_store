import {getCart} from '../middlewares/cartMiddleware.js'
import {dbPool} from '../config/database.js'

export class OrderController {
  constructor() {
    this.placeOrder = this.placeOrder.bind(this)
    this.writeToOrders = this.writeToOrders.bind(this)
    this.index = this.index.bind(this)
    this.searchForOrder = this.searchForOrder.bind(this)
  }

  async index(req, res, next) {
    const userID = Number(req.session.userID)
    const allOrders = await this.getUsersOrders(userID)
    allOrders.forEach((order) => {
      order.created = order.created.toLocaleDateString('sv-SE')
    })
    res.render('orders', {allOrders: allOrders, invoice: null, test: null})
  }

  async getUsersOrders(userID) {
    try {
      const [allOrders] = await dbPool.execute(`SELECT * FROM orders WHERE userid = ?`, [userID])
    return allOrders
    } catch (error) {
      next(error)
    }
  }

  async placeOrder(req, res, next) {
    const userID = Number(req.session.userID)
    const cart = await getCart(userID)

    const orderNumber = await this.writeToOrders(userID)
    await this.writeToOrderDetails(orderNumber, cart)
    const allOrders = await this.getUsersOrders(userID)

    allOrders.forEach((order) => {
      order.created = order.created.toLocaleDateString('sv-SE')
    })

    const invoiceData = await this.createInvoiceData(orderNumber)
    await this.emptyUsersCart(userID)

    res.render('orders', {allOrders: allOrders, invoice: invoiceData})
  }

  async writeToOrders(userID) {
    const createdDate = new Date().toLocaleDateString('sv-SE')

    const member = await this.getMember(userID)

    try {
      const [result] = await dbPool.execute(
        `INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip) VALUES (?, ?, ?, ?, ?)`,
        [userID, createdDate, member.address, member.city, member.zip]
      )
      return result.insertId // Order number
    } catch (error) {
      next(error)
    }
  }

async writeToOrderDetails(orderNumber, cart) {
  if (cart.length === 0) return;
  
  try {
    //Placeholders: (?, ?, ?, ?), (?, ?, ?, ?), ...
    const placeholders = cart.map(() => '(?, ?, ?, ?)').join(', ')
  
    // Make array
    const values = cart.flatMap(item => [
      orderNumber,
      item.isbn,
      item.qty,
      item.line_total
    ])
    
    await dbPool.execute(
      `INSERT INTO odetails (ono, isbn, qty, amount) VALUES ${placeholders}`,
      values
    )  
  } catch (error) {
    next(error)
  }
}

  async getMember(userID) {
    try {
      const [userInfo] = await dbPool.execute(`SELECT * FROM members WHERE userid = ?`, [userID])
      return userInfo[0]
    } catch (error) {
      next(error)
    }
  }

  async emptyUsersCart(userID) {
    try {
      await dbPool.execute(`DELETE FROM cart WHERE userid = ?`, [userID])
    } catch (error) {
      next(error)
    }
  }

  async createInvoiceData(orderNumber) {
    try {
      const [allOrderDetails] = await dbPool.execute(
      `
      SELECT od.ono, od.isbn, b.title, ROUND(b.price, 2) as price, od.qty, od.amount, DATE(o.created) AS created, m.fname, m.lname, o.shipAddress, o.shipCity, o.shipZip,
      SUM(od.amount) OVER (PARTITION BY od.ono) AS orderTotal 
      FROM odetails od
      JOIN orders o ON od.ono = o.ono
      JOIN books b ON od.isbn = b.isbn
      JOIN members m ON o.userid = m.userid
      WHERE od.ono = ?`,
      [orderNumber]
      )

      let invoiceData = {
      orderNumber: allOrderDetails[0].ono,
      created: allOrderDetails[0].created.toLocaleDateString('sv-SE'),
      delivery: this.calculateDeliveryDate(allOrderDetails[0].created),
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
    } catch (error) {
      next(error)
    }
  }

  calculateDeliveryDate(orderDate) {
    const deliveryDate = new Date(orderDate)
    deliveryDate.setDate(deliveryDate.getDate() + 7)
    return deliveryDate.toLocaleDateString('sv-SE')
  }

  async searchForOrder(req, res) {
    const orderNumber = Number(req.body.orderNumber)

    const invoiceData = await this.createInvoiceData(orderNumber)

    res.json(invoiceData)
  }
}
