const { handleResponse } = require('../helper/index')
const TestService = require('../service/test')

class TestControler {
  showTest (req, res) {
    TestService.showTest(req, res)
  }
}

module.exports = new TestControler()