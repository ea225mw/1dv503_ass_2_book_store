import {dbPool} from '../config/database.js'

export class BooksController {
  constructor() {
    this.index = this.index.bind(this)
    this.search = this.search.bind(this)
  }

  index(req, res, next) {
    res.render('./books', {
      viewData: null,
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
    // console.log('Before query in subjectOnly')
    const [rows] = await dbPool.execute('SELECT * FROM books WHERE subject LIKE ? LIMIT 5', [`%${subject}%`])
    // console.log('After query in subjectOnly')
    return rows
  }

  async getBooks(subject, author, title) {
    // console.log('Before query in getBooks')
    const [rows] = await dbPool.execute(
      'SELECT * FROM books WHERE subject LIKE ? AND author LIKE ? AND title LIKE ? LIMIT 5',
      [`%${subject}%`, `%${author}%`, `%${title}%`]
    )
    // console.log('After query in getBooks')
    return rows
  }
}
