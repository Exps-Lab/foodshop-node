const TestService = require('../service/test')
const BasePosClass = require('../service/base-class/pos-base')

class TestController extends BasePosClass {
  constructor() {
    super()
    this.name = 'hello world'
  }

  async showTest (req, res) {
    const data = await _common.RedisInstance.hSet('aaa', {
      name: 'aa',
      age: 12
    }, '', 1001)
    res.json({
      data
    })
    // try {
    //   _common.validate({
    //     name: 'string',
    //   }, req)
    // } catch (err) {
    //   res.json({
    //     code: 0,
    //     msg: '[Request Params Error]',
    //     errLog: err,
    //   })
    //   return
    // }
    // TestService.showTest(req, res)
  }

  async sessionDemo (req, res) {
    const { id } = req.query
    const data = await _common.RedisInstance.hDel('aaa', 'age')
    console.log(data)
    res.json({
      data
    })
  }

  getText () {
    return this.name
  }
}

module.exports = new TestController()
