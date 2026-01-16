export function errorHandler(err, req, res, next) {
  if (err.sqlMessage && err.sqlMessage.includes('members.email')) {
    req.session.flash = {
      type: 'warning',
      text: 'Email already registered.',
    }
    return res.redirect('/register')
  }

  if (err.sqlMessage && err.sqlMessage.includes('Data too long')) {
    req.session.flash = {
      type: 'warning',
      text: 'Some fields included too many characters.',
    }
    return res.redirect('/register')
  }

  res.status(500).render('error', {
    error: process.env.NODE_ENV === 'development' ? err : {},
  })
}
