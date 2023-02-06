const UserService = require('../../../service/h5/user/login')

class MainUserController {
  // 401 auth 用户名密码校验测试
  // 写死 用户名：test 密码：test
  authDemo (req, res) {
    const authHeaderVal = req.header('Authorization')
    if (authHeaderVal) {
      const auth = authHeaderVal.split(" ")[1]
      const b = new Buffer.from(auth, 'base64').toString('utf8')
      const [ uName, password ] = b.split(':');
      if (authHeaderVal && uName === 'test' && password === 'test') {
        res.end('AUTH Access!')
      } else {
        res.header('WWW-Authenticate', 'Basic realm="."')
        res.status(401).send('NO AUTH')
      }
    } else {
      res.header('WWW-Authenticate', 'Basic realm="."')
      res.status(401).send('NO AUTH')
    }
  }

  getCapture (req, res) {
    UserService.getCapture(req, res)
  }

  login (req, res) {
    try {
      _common.validate({
        username: 'string',
        password: 'string',
        code: 'string'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    UserService.login(req, res)
  }

  logout (req, res) {
    UserService.logout(req, res)
  }

  getUserInfo (req, res) {
    UserService.getUserInfo(req, res)
  }
}

module.exports = new MainUserController()
