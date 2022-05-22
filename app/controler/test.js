const TestService = require('../service/test')

class TestControler {
  showTest (req, res) {
    try {
      _common.validate({
        name: 'string',
      }, req);
    } catch (err) {
      res.json(_common.handleResponse({
        data: null,
        type: 'failed',
        msg: '[Request Params Error]',
        errMes: err,
      }));
      return;
    }
    TestService.showTest(req, res)
  }

  sessionDemo (req, res) {
    let { counter } = req.session;
    if (!counter) {
      req.session.counter = 1;
      res.end('welcome to the session demo. try to refresh this page!')
    } else {
      req.session.counter += 1;
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.counter + '</p>')
      res.write('<p>session expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      res.end()
    }
  }

  // 401 auth 用户名密码校验测试
  // 写死 用户名：test 密码：test
  authDemo (req, res) {
    const authHeaderVal = req.header('Authorization')
    const auth = req.header('Authorization').split(" ")[1]
    const b = new Buffer.from(auth, 'base64').toString('utf8')
    const [ uName, password ] = b.split(':');
    if (authHeaderVal && uName === 'test' && password === 'test') {
      res.end('AUTH Access!')
    } else {
      res.header('WWW-Authenticate', 'Basic realm="."')
      res.status(401).send('NO AUTH')
    }
  }
}

module.exports = new TestControler()