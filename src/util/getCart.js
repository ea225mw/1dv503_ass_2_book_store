import {dbPool} from '../config/database.js'

export async function getCart(userID) {
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
