import {dbPool} from '../config/database.js'
import bcrypt from 'bcryptjs'

export class RegisterController {
  #errorsToBeReported = {}

  index(req, res, next) {
    res.render('register', {
      errors: null,
      formData: {},
    })
  }

  async registerNewMember(req, res, next) {
    try {
      const {firstName, lastName, address, city, zipCode, phone, email, password} = req.body

      const isEmailNotRegistered = await this.#checkIfEmailIsNotRegistered(email)
      const isZipCodeValid = this.#validateZipCode(zipCode)
      const isEmailValid = this.#validateEmail(email)
      const isLengthsValid = this.#validateLengths(firstName, lastName, address, city, password)

      const hashedPassword = await this.#hashPassword(password)

      if (isEmailNotRegistered && isZipCodeValid && isEmailValid && isLengthsValid) {
        await dbPool.execute(
          'INSERT INTO members(fname, lname, address, city, zip, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            firstName.trim(),
            lastName.trim(),
            address.trim(),
            city.trim(),
            Number.parseInt(zipCode.trim()),
            phone.trim(),
            email.trim(),
            hashedPassword,
          ]
        )
        req.session.flash = {type: 'success', text: 'Account successfully created. Please log in.'}
        res.redirect('login')
      } else {
        res.render('register', {
          errors: this.#errorsToBeReported,
          formData: req.body,
        })
        this.#errorsToBeReported = {}
      }
    } catch (error) {
      next(error)
    }
  }

  async #checkIfEmailIsNotRegistered(email) {
    const [rows] = await dbPool.execute('SELECT * FROM members WHERE email = ?', [email.trim()])
    const notRegistered = rows.length === 0
    if (notRegistered) return true
    else {
      this.#errorsToBeReported.emailAlreadyRegisteredError = 'Email address already registered.'
    }
  }

  #validateZipCode(zipcode) {
    const zipCodeRegExp = new RegExp(/^\d{5}$/)
    const correct = zipCodeRegExp.test(zipcode.trim())
    if (correct) return true
    else {
      this.#errorsToBeReported.zipCodeError = 'The zip code is not correctly formatted. Should be numbers XXXXX.'
      return false
    }
  }

  #validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const correct = emailRegex.test(email)
    if (correct) return true
    else this.#errorsToBeReported.emailError = 'Please check email format.'
  }

  #validateLengths(firstName, lastName, address, city, password) {
    const validFirstName = firstName.length <= 50
    const validLastName = lastName.length <= 50
    const validAddress = address.length <= 50
    const validCity = city.length <= 30
    const validPassword = password.length <= 200

    if (validFirstName && validLastName && validAddress && validCity && validPassword) return true
    else {
      this.#errorsToBeReported.lengthErrors = 'Some fields contains too many carachters.'
      return false
    }
  }

  async #hashPassword(password) {
    return await bcrypt.hash(password, 10)
  }
}
