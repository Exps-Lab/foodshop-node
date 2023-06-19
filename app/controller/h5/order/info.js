
const OrderInfoService = require('../../../service/h5/order/info')

class OrderConfirmController {
  // 获取订单详情
  async getOrderDetail (req, res) {
    try {
      _common.validate({
        orderNum: {
          type: 'string',
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
    await OrderInfoService.getOrderDetail(req, res)
  }
}

module.exports = new OrderConfirmController()
