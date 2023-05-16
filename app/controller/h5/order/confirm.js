
const OrderConfirmService = require('../../../service/h5/order/confirm')

class OrderConfirmController {
  // 获取离定位最近的地址
  async getRecentAddress (req, res) {
    try {
      _common.validate({
        userNowPos: {
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
    await OrderConfirmService.getRecentAddress(req, res)
  }
}

module.exports = new OrderConfirmController()
