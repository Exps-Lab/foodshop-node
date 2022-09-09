// const UserModel  = require('../../model/main-user/login')
const Instance = require("../../../helper/captcha")

class LoginService {
  async addUser(req, res) {
    const { code, svg } = Instance.init()
    res.setHeader('Content-Type', 'image/svg+xml');
    // res.json({
    //   data: svg,
    //   msg: 'succeed!'
    // })
    res.end(svg)
  }
}

module.exports = new LoginService()
