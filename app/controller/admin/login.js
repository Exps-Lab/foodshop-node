const LoginService = require('../../service/admin/login')

class AdminController {
  login (req, res) {
    try {
      _common.validate({
        username: 'string',
        password: 'string',
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    LoginService.login(req, res)
  }
  logout (req, res) {
    LoginService.logout(req, res)
  }
}

module.exports = new AdminController()
