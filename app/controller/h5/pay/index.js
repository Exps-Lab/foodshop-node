
const OrderPayService = require('../../../service/h5/pay/index')

class OrderPayController {
  // 支付订单
  async orderPay (req, res) {
    try {
      _common.validate({
        orderNum: {
          type: 'string'
        },
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await OrderPayService.pay(req, res)
  }
}

module.exports = new OrderPayController()
