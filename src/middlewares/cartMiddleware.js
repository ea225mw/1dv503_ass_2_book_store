import {dbPool} from '../config/database.js'

export async function cartMiddleware(req, res, next) {
  if (!req.session.userID) {
    res.locals.cart = []
    res.locals.cartItemCount = 0
    return next()
  }

  try {
    const cartItems = await getCart(Number(req.session.userID))

    res.locals.cart = cartItems

    next()
  } catch (err) {
    next(err)
  }
}

export async function getCart(userID) {
  const [rows] = await dbPool.execute(
    `
      SELECT b.isbn, b.title, ROUND(b.price, 2) as price, c.qty, ROUND(b.price * c.qty) AS line_total, ROUND(SUM(b.price * c.qty) OVER (), 2) AS total_price
      FROM books b
      JOIN cart c ON b.isbn = c.isbn
      WHERE c.userid = ?`,
    [userID]
  )
  return rows
}
