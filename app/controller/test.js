const TestService = require('../service/test')
const BasePosClass = require('../service/base-class/pos-base')

class TestController extends BasePosClass {
  constructor() {
    super()
    this.name = 'hello world'
  }

  async showTest (req, res) {
    const data = await _common.RedisClient.set('name', 111, {
      EX: 5,
      NX: true,
    })
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
    const tempData = await _common.RedisClient.hGetAll(`sale:shoppingBag:112131:u-${id}`)
    const data = {
      shop_id: tempData.shop_id,
      choseGoods: JSON.parse(tempData.choseGoods)
    }
    res.json({
      data
    })
  }

  getText () {
    return this.name
  }
}

module.exports = new TestController()
