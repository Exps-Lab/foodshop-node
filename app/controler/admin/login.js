const LoginService = require('../../service/admin/login')

class AdminControler {
  login (req, res) {
    try {
      _common.validate({
        username: 'string',
        password: 'string',
      }, req)
    } catch (err) {
      res.json(_common.handleResponse({
        data: null,
        type: 'failed',
        msg: '[Request Params Error]',
        errMes: err,
      }));
      return
    }
    LoginService.login(req, res)
  }
  logout (req, res) {
    LoginService.logout(req, res)
  }
}

module.exports = new AdminControler()