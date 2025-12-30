import {dbPool} from '../config/database.js'
import bcrypt from 'bcryptjs'

export class RegisterController {
  index(req, res, next) {
    res.render('./register')
  }

  async registerNewMember(req, res, next) {
    const {firstName, lastName, address, city, zipCode, phone, email, password} = req.body

    const isEmailNotRegistered = await this.#checkIfEmailIsNotRegistered(email)
    const hashedPassword = await this.hashPassword(password)

    if (isEmailNotRegistered) {
      await dbPool.execute(
        'INSERT INTO members(fname, lname, address, city, zip, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          firstName.trim(),
          lastName.trim(),
          address.trim(),
          city.trim(),
          Number.parseInt(zipCode),
          phone.trim(),
          email.trim(),
          hashedPassword,
        ]
      )
      res.redirect('./')
    } else {
      res.status(409).json({message: 'Email already registered.'})
    }
  }

  async #checkIfEmailIsNotRegistered(email) {
    const [rows] = await dbPool.execute('SELECT * FROM members WHERE email = ?', [email.trim()])
    return rows.length === 0
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10)
  }
}
