export class RegisterController {
  index(req, res, next) {
    res.render('./register')
  }

  registerNewMember(req, res, next) {
    console.log('Form recieved', req.body)
    res.redirect('./')
  }
}
