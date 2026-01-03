import {dbPool} from '../config/database.js'

export class BooksController {
  constructor() {
    this.index = this.index.bind(this)
    this.search = this.search.bind(this)
  }

  index(req, res) {
    res.render('./books', {
      viewData: {
        result: 'default',
      },
    })
  }

  async search(req, res) {
    const {subject, author, title} = req.body

    let searchResult

    if (author === '' && title === '') {
      searchResult = await this.getBooksOnSubjectOnly(subject)
    }

    if (author !== '' || title !== '') {
      searchResult = await this.getBooks(subject, author, title)
    }

    res.render('./books', {
      viewData: {
        subject: subject,
        author: author,
        title: title,
        result: searchResult,
      },
    })
  }

  async getBooksOnSubjectOnly(subject) {
    const [rows] = await dbPool.execute('SELECT * FROM books WHERE subject LIKE ? LIMIT 5', [`%${subject}%`])
    return rows
  }

  async getBooks(subject, author, title) {
    if (subject === 'all') {
      return await this.#getBooksFromAllSubjects(author, title)
    }

    const [rows] = await dbPool.execute(
      'SELECT * FROM books WHERE subject LIKE ? AND author LIKE ? AND title LIKE ? LIMIT 5',
      [`%${subject}%`, `%${author}%`, `%${title}%`]
    )
    return rows
  }

  async #getBooksFromAllSubjects(author, title) {
    const [rows] = await dbPool.execute('SELECT * FROM books WHERE author LIKE ? AND title LIKE ? LIMIT 5', [
      `%${author}%`,
      `%${title}%`,
    ])
    return rows
  }
}
