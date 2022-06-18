const UserModel  = require('../../model/admin/user')

class AdminLoginService {
  roleConf = {
    'super': {
      role: 1,
      role_name: '超管',
    },
    'user': {
      role: 2,
      role_name: '普通用户',
    }
  }

  async login(req, res) {
    const { username } = req.body
    const [ resData ] = await UserModel.find({ username })

    if (resData) {
      this.checkUser(req, res, resData)
    } else {
      this.addUser(req, res)
    }
  }
  addUser (req, res) {
    const { username, password } = req.body
    // 先控制用页面入口添加的都是用户
    const { role, role_name } = this.roleConf['user']
    const comData = {
      username,
      role,
      role_name,
      c_time: Date.now(),
    }

    UserModel.create({
      ...comData,
      password,
    }).then(data => {
      req.session.username = username
      res.json({
        data: comData,
        msg: 'login success'
      })
    })
  }
  checkUser (req, res, resData) {
    const { password } = req.body
    const { username, role, role_name, c_time } = resData

    if (password === resData.password) {
      req.session.username = username
      res.json({
        data: {
          username,
          role,
          role_name,
          c_time
        },
        msg: 'login success'
      })
    } else {
      res.json({
        code: 20001,
        msg: '用户名或密码错误，请重试！'
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

module.exports = new AdminLoginService()
