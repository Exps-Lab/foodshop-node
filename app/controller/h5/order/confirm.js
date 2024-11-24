
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

  // 获取确认订单页详情
  async getConfirmDetail (req, res) {
    try {
      _common.validate({
        shoppingBagId: {
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
    await OrderConfirmService.getConfirmDetail(req, res)
  }

  // 生产订单
  async createOrder (req, res) {
    try {
      _common.validate({
        shoppingBagId: {
          type: 'string',
        },
        addressId: {
          type: 'number',
        },
        orderRemarks: {
          type: 'string?',
        },
        orderWare: {
          type: 'boolean'
        },
        sendCostTime: {
          type: 'number'
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await OrderConfirmService.createOrder(req, res)
  }
}

module.exports = new OrderConfirmController()
