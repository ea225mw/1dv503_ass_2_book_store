import {dbPool} from '../config/database.js'

export class BooksController {
  #resultsPerPage = 5

  constructor() {
    this.index = this.index.bind(this)
    this.search = this.search.bind(this)
  }

  index(req, res) {
    res.render('./books', {
      subject: '',
      author: '',
      title: '',
      result: 'noSearchDoneYet',
      page: null,
      totalPages: null,
      hasSearchResults: false,
      hasBooks: false,
      showPagination: false,
    })
  }

  async search(req, res) {
    const {subject = 'all', author = '', title = ''} = req.query
    let page = 1
    if (req.query.page) page = req.query.page

    const currentPage = Math.max(1, parseInt(page, 10) || 1)
    const offset = (currentPage - 1) * this.#resultsPerPage

    let books
    let totalCount

    if (subject === 'all') {
      ;[books, totalCount] = await this.getBooksFromAllSubjects(author, title, offset)
    } else {
      ;[books, totalCount] = await this.getBooks(subject, author, title, offset)
    }

    const totalPages = Math.ceil(totalCount / this.#resultsPerPage)

    const hasSearchResults = Array.isArray(books)
    const hasBooks = hasSearchResults && books.length > 0
    const showPagination = totalPages > 1

    const viewData = {
      subject: subject,
      author: author,
      title: title,
      result: books,
      page: currentPage,
      totalPages: totalPages,
      hasSearchResults: hasSearchResults,
      hasBooks: hasBooks,
      showPagination: showPagination,
    }

    res.render('books', viewData)
  }

  async getBooks(subject, author, title, offset = 0) {
    try {
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
    } catch (error) {
      req.session.flash = {type: 'warning', text: error.message}
      next(error)
    }
  }

  async getBooksFromAllSubjects(author, title, offset = 0) {
    try {
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

      return [rows, count]
    } catch (error) {
      next(error)
    }
  }
}
