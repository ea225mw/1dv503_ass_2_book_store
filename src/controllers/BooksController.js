import {dbPool} from '../config/database.js'
import {getCart} from '../util/getCart.js'

export class BooksController {
  #resultsPerPage = 5

  constructor() {
    this.index = this.index.bind(this)
    this.search = this.search.bind(this)
  }

  index(req, res) {
    const cart = getCart(Number(req.session.userID))
    res.render('./books', {
      viewData: {
        result: 'default',
        cart: cart,
      },
    })
  }

  async search(req, res) {
    const {subject = 'all', author = '', title = ''} = req.query
    let page = 1
    if (req.query.page) page = req.query.page

    const currentPage = Math.max(1, parseInt(page, 10) || 1)
    const offset = (currentPage - 1) * this.#resultsPerPage

    console.log(req.query)
    console.log(subject, author, title, currentPage, offset)
    console.log(typeof subject, typeof author, typeof title, typeof currentPage, typeof offset)

    let books
    let totalCount

    if (subject === 'all') {
      ;[books, totalCount] = await this.getBooksFromAllSubjects(author, title, offset)
    } else {
      ;[books, totalCount] = await this.getBooks(subject, author, title, offset)
    }

    const totalPages = Math.ceil(totalCount / this.#resultsPerPage)

    res.render('./books', {
      viewData: {
        subject,
        author,
        title,
        result: books,
        page: currentPage,
        totalPages,
      },
    })
  }

  async getBooks(subject, author, title, offset = 0) {
    const limit = Number(this.#resultsPerPage)
    const safeOffset = Number(offset)

    const [[{count}]] = await dbPool.execute(
      `SELECT COUNT(*) AS count
    FROM books
    WHERE subject LIKE ?
      AND author LIKE ?
      AND title LIKE ?
    `,
      [`%${subject}%`, `${author}%`, `%${title}%`]
    )

    const [rows] = await dbPool.query(
      `SELECT *
    FROM books
    WHERE subject LIKE ?
      AND author LIKE ?
      AND title LIKE ?
    ORDER BY title
    LIMIT ? OFFSET ?
    `,
      [`%${subject}%`, `${author}%`, `%${title}%`, limit, safeOffset]
    )
    return [rows, count]
  }

  async getBooksFromAllSubjects(author, title, offset = 0) {
    console.log('Hello from getBooksFromAllSubjects')
    const limit = Number(this.#resultsPerPage)
    const safeOffset = Number(offset)

    const [[{count}]] = await dbPool.execute(
      `SELECT COUNT(*) AS count
    FROM books
    WHERE author LIKE ?
      AND title LIKE ?
    `,
      [`${author}%`, `%${title}%`]
    )

    const [rows] = await dbPool.query(
      `SELECT *
    FROM books
    WHERE author LIKE ?
      AND title LIKE ?
      ORDER BY title
    LIMIT ? OFFSET ?
    `,
      [`${author}%`, `%${title}%`, limit, safeOffset]
    )

    console.log('safeOffset', safeOffset)
    console.log('rows', rows)

    return [rows, count]
  }
}
