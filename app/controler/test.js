const TestService = require('../service/test')

class TestControler {
  showTest (req, res) {
    try {
      _common.validate({
        name: 'string',
      }, req)
    } catch (err) {
      res.json({
        code: 0,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    TestService.showTest(req, res)
  }

  sessionDemo (req, res) {
    let { counter } = req.session;
    if (!counter) {
      req.session.counter = 1
      res.end('welcome to the session demo. try to refresh this page!')
    } else {
      req.session.counter += 1
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.counter + '</p>')
      res.write('<p>session expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      res.end()
    }
  }
}

module.exports = new TestControler()