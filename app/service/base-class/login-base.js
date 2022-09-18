const H5UserModel  = require('../../model/h5/user/login')
const AdminUserModel  = require('../../model/admin/user')
const RoleModel = require('../../model/admin/role')

class LoginBase {
  // origin: admin/h5
  constructor(origin) {
    if (typeof origin === "undefined") {
      throw new Error('origin是必传项!')
    }
    this.origin = origin
    this.UserModel = this.origin === 'h5' ? H5UserModel : AdminUserModel
  }

  async baseLogin (req, res) {
    const { username } = req.body

    if (this.origin === 'h5') {
      if (!this.checkCapture(req)) {
        res.json({
          code: 20002,
          msg: '验证码错误！'
        })
        return false
      }
    }

    const resData = await this.UserModel.findOne({ username })
    if (resData) {
      this.checkUser(req, res, resData)
    } else {
      this.addUser(req, res)
    }
  }

  addUser (req, res) {
    const { username, password } = req.body
    let comData = {
      username,
      c_time: Date.now(),
    }
    if (this.origin === 'admin') {
      const { role, role_name } = this.getUserRole()
      comData = Object.assign(comData, {
        role,
        role_name
      })
    }

    this.UserModel.create({
      ...comData,
      password
    }).then(data => {
      const { u_id } = data
      req.session.username = username
      req.session.h5_uid = u_id
      res.json({
        data: comData,
        msg: 'login success'
      })
    })
  }

  checkUser (req, res, resData) {
    const { password } = req.body
    const { username, u_id } = resData

    if (password === resData.password) {
      req.session.username = username
      req.session.h5_uid = u_id
      res.json({
        data: resData,
        msg: 'login success'
      })
    } else {
      res.json({
        code: 20001,
        msg: '用户名,密码错误或该用户名已被注册!'
      })
    }
  }

  baseLogout (req, res) {
    req.session.destroy()
    res.json({
      msg: 'logout success'
    })
  }

  // 判断验证码
  checkCapture (req) {
    const { code } = req.body
    const sessionCode = req.session.captureCode
    return code === sessionCode
  }

  // 获取普通用户角色配置
  async getUserRole () {
    const adminRole = await RoleModel.find().lean()
    for (let i=0; i<adminRole.length; i++) {
      // role: 1超管 2普通用户
      if (adminRole[i].role === 2) {
        return adminRole[i]
      }
    }
  }
}

module.exports = LoginBase


