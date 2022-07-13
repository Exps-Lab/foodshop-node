const TestService = require('../service/test')
const BasePosClass = require('../service/base-class/base')

class TestController extends BasePosClass {
  constructor() {
    super()
    this.name = 'hello world'
  }

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

  async sessionDemo (req, res) {
    const text = this.getText()
    res.json({
      data: {
        text,
        ip: await super.getRemoteAddress()
      }
    })
    // let { counter } = req.session;
    // if (!counter) {
    //   req.session.counter = 1
    //   res.end('welcome to the session demo. try to refresh this page!')
    // } else {
    //   req.session.counter += 1
    //   res.setHeader('Content-Type', 'text/html')
    //   res.write('<p>views: ' + req.session.counter + '</p>')
    //   res.write('<p>session expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    //   res.end()
    // }
  }

  getText () {
    return this.name
  }
}

module.exports = new TestController()
