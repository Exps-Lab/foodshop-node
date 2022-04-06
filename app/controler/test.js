const TestService = require('../service/test')

class TestControler {
  showTest (req, res) {
    try {
      _common.validateParam({
        id: 'string',
        age: 'email'
      }, req)
      TestService.showTest(req, res)
    } catch (err) {
      res.json(_common.handleResponse({
        data: null,
        type: 'failed',
        msg: '[Request Params Error]',
        errMes: err,
      }))
    }
  }
}

module.exports = new TestControler()