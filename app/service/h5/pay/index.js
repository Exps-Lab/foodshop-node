const AccountService = require("../user/account")
const OrderInfoService = require("../order/info")
const OrderModal = require("../../../model/h5/order/order")

class OrderPayService {
  async pay (req, res) {
    const { u_id } = req.session
    const { orderNum } = req.body
    try {
      // 1.查询账户余额 2.查询订单支付金额 3.金额够余额消费，不够报错提示
      const { money: accountMoney } = await AccountService.getAccountMoneyHelper(u_id)
      const { pay_price } = await OrderInfoService.getOrderDetailHelper(orderNum)
      // [note]判断是否够支付
      if (pay_price > accountMoney) {
        const errMsg = `余额不足，账户仅剩 ${accountMoney} 币`
        res.json({
          code: 20004,
          data: {
            accountMoney,
            pay_price,
            orderNum
          },
          msg: errMsg,
          errLog: new Error(errMsg)
        })
      } else {
        const afterPayAccount = await AccountService.updateAccountMoneyHelper(u_id, pay_price, 'minus')
        await OrderInfoService.orderPaySuccessHelper(orderNum)
        res.json({
          data: {
            orderNum,
            afterPayAccount
          },
          msg: '订单支付成功，已准备配送'
        })
      }
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
}

module.exports = new OrderPayService()
