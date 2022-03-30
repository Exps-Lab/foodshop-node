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
}

module.exports = new TestControler()