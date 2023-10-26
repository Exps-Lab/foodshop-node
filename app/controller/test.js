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
    // const { id } = req.query
    // const data = await _common.RedisInstance.hDel('aaa', 'age')
    // console.log(data)
    // res.json({
    //   data
    // })
    res.json({
      code: 200,
      data: {
        "list": [{
          "id": 2,
          "isMainly": 1,
          "coverImage": 'https://static-cdn.kunyuanfund.com/photo/haiwai_icon.png',
          "title": "UTOPIA史",
          "country": '泰国',
          "area": "普吉岛是最大",
          "usableArea": "36.2㎡",
          "deliveryType": '现房',
          "rentIncome": 123.33,
          "minAmount": 5579712,
          "maxAmount": 1234712,
          "currency": '人民币',
        }, {
          "id": 1,
          "isMainly": 0,
          "coverImage": 'https://static-cdn.kunyuanfund.com/photo/haiwai_icon.png',
          "title": "UTOPIA史上最强之U2上最上最UTOPIA史上最强之U2上最上最",
          "country": '泰国',
          "area": "普吉岛这是最大普吉岛这是最大",
          "usableArea": "25.5-36.2㎡",
          "deliveryType": '期房',
          "rentIncome": 12,
          "minAmount": 230,
          "maxAmount": 400,
          "currency": '人民币',
        }, {
          "id": 1,
          "isMainly": 0,
          "coverImage": 'https://static-cdn.kunyuanfund.com/photo/haiwai_icon.png',
          "title": "UTOPIA史上最强之U2上最上最UTOPIA史上最强之U2上最上最",
          "country": '泰国',
          "area": "普吉岛这是最大普吉岛这是最大",
          "usableArea": "25.5-36.2㎡",
          "deliveryType": '期房',
          "rentIncome": 12,
          "minAmount": 230,
          "maxAmount": 400,
          "currency": '人民币',
        }, {
          "id": 1,
          "isMainly": 0,
          "coverImage": 'https://static-cdn.kunyuanfund.com/photo/haiwai_icon.png',
          "title": "UTOPIA史上最强之U2上最上最UTOPIA史上最强之U2上最上最",
          "country": '泰国',
          "area": "普吉岛这是最大普吉岛这是最大",
          "usableArea": "25.5-36.2㎡",
          "deliveryType": '期房',
          "rentIncome": 12,
          "minAmount": 230,
          "maxAmount": 400,
          "currency": '人民币',
        }, {
          "id": 1,
          "isMainly": 0,
          "coverImage": 'https://static-cdn.kunyuanfund.com/photo/haiwai_icon.png',
          "title": "UTOPIA史上最强之U2上最上最UTOPIA史上最强之U2上最上最",
          "country": '泰国',
          "area": "普吉岛这是最大普吉岛这是最大",
          "usableArea": "25.5-36.2㎡",
          "deliveryType": '期房',
          "rentIncome": 12,
          "minAmount": 230,
          "maxAmount": 400,
          "currency": '人民币',
        }, {
          "id": 1,
          "isMainly": 0,
          "coverImage": 'https://static-cdn.kunyuanfund.com/photo/haiwai_icon.png',
          "title": "UTOPIA史上最强之U2上最上最UTOPIA史上最强之U2上最上最",
          "country": '泰国',
          "area": "普吉岛这是最大普吉岛这是最大",
          "usableArea": "25.5-36.2㎡",
          "deliveryType": '期房',
          "rentIncome": 12,
          "minAmount": 230,
          "maxAmount": 400,
          "currency": '人民币',
        }],
        "total": 16,
        "hasNextPage": false
      }
    })
  }

  getText () {
    return this.name
  }
}

module.exports = new TestController()
