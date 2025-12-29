export class HomeController {
  index(req, res, next) {
    res.redirect('./home')
  }
}
