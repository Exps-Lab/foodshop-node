const LoginService = require('../../service/main-user/login')

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

  addUser (req, res) {
    LoginService.addUser(req, res)
  }
}

module.exports = new MainUserController()
