import {dbPool} from '../config/database.js'

export class RegisterController {
  index(req, res, next) {
    res.render('./register')
  }

  registerNewMember(req, res, next) {
    const [firstName, lastName, address, city, zipCode, phone, email, password] = req.body
    console.log('Form recieved. req.body: ', req.body)
    res.redirect('./')
  }
}
