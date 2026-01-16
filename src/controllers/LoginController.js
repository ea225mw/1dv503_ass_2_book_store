import bcrypt from 'bcryptjs'
import {dbPool} from '../config/database.js'

export class LoginController {
  index(req, res, next) {
    if (!req.session.userID) {
      res.render('login')
    } else {
      res.render('home')
    }
  }

  async logUserIn(req, res, next) {
    try {
      const {email, password} = req.body
      const [rows] = await dbPool.execute('SELECT * FROM members WHERE email = ? LIMIT 1', [email])
      const user = rows[0]

      if (rows.length > 0) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
          req.session.regenerate(() => {
            req.session.userID = user.userid
            req.session.currentUserName = user.fname
            res.redirect('./')
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }
}
