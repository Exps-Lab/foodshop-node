// const UserModel  = require('../../model/admin/user')
const LoginBase = require("../base-class/login-base")

class AdminLoginService extends LoginBase {
  constructor() {
    super('admin')
  }
  login (req, res) {
    this.baseLogin(req, res)
  }

  logout (req, res) {
    this.baseLogout(req, res)
  }
}

module.exports = new AdminLoginService()
