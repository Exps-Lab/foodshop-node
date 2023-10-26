
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

  // 获取订单列表
  async getOrderList (req, res) {
    try {
      _common.validate({
        pageNum: {
          type: 'number',
          convertType: 'number'
        },
        pageSize: {
          type: 'number?',
          convertType: 'number'
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
    await OrderInfoService.getOrderList(req, res)
  }

  // 取消订单
  async cancelOrder (req, res) {
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
    await OrderInfoService.cancelOrder(req, res)
  }
}

module.exports = new OrderConfirmController()
