const UserModel  = require('../../../model/h5/user/login')
const Instance = require("../../../helper/captcha")

class LoginService {
  async getCapture (req, res) {
    const { code, svg } = Instance.init()
    req.session.captureCode = code
    res.json({
      data: svg,
      msg: 'succeed!'
    })
  }

  async login (req, res) {
    const { username, code } = req.body
    const sessionCode = req.session.captureCode
    if (code !== sessionCode) {
      res.json({
        code: 20002,
        msg: '验证码错误！'
      })
    }

    const resData = await UserModel.findOne({ username })
    if (resData) {
      this.checkUser(req, res, resData)
    } else {
      this.addUser(req, res)
    }
  }

  addUser (req, res) {
    const { username, password } = req.body
    const comData = {
      username,
      c_time: Date.now(),
    }

    UserModel.create({
      ...comData,
      password
    }).then(data => {
      const { u_id } = data
      req.session.username = username
      req.session.h5_uid = u_id
      res.json({
        data: {
          ...comData,
          u_id
        },
        msg: 'login success'
      })
    })
  }

  checkUser (req, res, resData) {
    const { password } = req.body
    const { username, c_time, u_id } = resData

    if (password === resData.password) {
      req.session.username = username
      req.session.h5_uid = u_id
      res.json({
        data: {
          username,
          c_time,
          u_id
        },
        msg: 'login success'
      })
    } else {
      res.json({
        code: 20001,
        msg: '用户名,密码错误或该用户名已被注册!'
      })
    }
  }

  logout (req, res) {
    req.session.destroy()
    res.json({
      msg: 'logout success'
    })
  }
}

module.exports = new LoginService()
