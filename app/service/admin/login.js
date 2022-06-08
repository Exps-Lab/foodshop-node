const AdminModel  = require('../../model/admin/login')

class AdminLoginService {
  async login(req, res) {
    const { username } = req.body
    const roleConf = {
      'super': {
        role: 1,
        roleName: '超管',
      },
      'user': {
        role: 2,
        roleName: '普通用户',
      }
    }
    const comData = {
      username,
      ctime: Date.now(),
      role: roleConf.user.role,
      roleName: roleConf.user.roleName,
    }

    const [ resData ] = await AdminModel.find({ username }).lean(true)
    if (resData) {
      this.checkUser(req, res, resData, comData)
    } else {
      this.addUser(req, res, comData)
    }
  }
  addUser (req, res, comData) {
    const { password } = req.body

    AdminModel.create({
      ...comData,
      password,
    }).then(data => {
      res.json(_common.handleResponse({
        data: comData,
        msg: 'login success'
      }));
    })
  }
  checkUser (req, res, resData, comData) {
     const { password } = req.body

    if (password === resData.password) {
      res.json(_common.handleResponse({
        data: comData,
        msg: 'login success'
      }));
    } else {
      res.json(_common.handleResponse({
        errCode: 10001,
        type: 'failed',
        data: null,
        msg: '用户名或密码错误，请重试！'
      }));
    }
  }
}

module.exports = new AdminLoginService()