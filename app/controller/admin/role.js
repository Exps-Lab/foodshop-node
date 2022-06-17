const LoginService = require('../../service/admin/role')

class AdminController {
  getRoleList (req, res) {
    LoginService.getRoleList(req, res)
  }
}

module.exports = new AdminController()
