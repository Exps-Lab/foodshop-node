// const UserModel  = require('../../model/h5/user/login')
const CaptchaInstance = require("../../../helper/captcha")
const LoginBase = require("../../base-class/login-base")


class LoginService extends LoginBase {
  constructor() {
    super('h5')
  }

  async getCapture (req, res) {
    const { code, svg } = CaptchaInstance.init()
    req.session.captureCode = code
    res.json({
      data: svg,
      msg: 'succeed!'
    })
  }

  login (req, res) {
    this.baseLogin(req, res)
  }
  logout (req, res) {
    this.baseLogout(req, res)
  }
}

module.exports = new LoginService()
