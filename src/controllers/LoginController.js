import bcrypt from 'bcryptjs'
import {dbPool} from '../config/database.js'

export class LoginController {
  index(req, res, next) {
    res.render('./login')
  }

  async logUserIn(req, res, next) {
    const {email, password} = req.body
    const [rows] = await dbPool.execute('SELECT * FROM members WHERE email = ? LIMIT 1', [email])
    console.log(rows)
    if (rows) {
      const match = await bcrypt.compare(password, rows[0].password)
      if (match) {
        console.log('Correct credentials')
      }
    }
  }
}
