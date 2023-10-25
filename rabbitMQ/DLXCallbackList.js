const OrderInfoService = require("../app/service/h5/order/info")

const MQDLXList = {
  orderPayCallback: async ({ orderNum }) => {
    // 该订单若超时未支付，则取消订单
    const { order_status } = await OrderInfoService.getOrderDetailHelper(orderNum)
    if (order_status === 0) {
      console.log('超时取消', orderNum)
      OrderInfoService.updateOrderDetailHelper(orderNum, {
        cancel_time: new Date().formatTime('yyyy-MM-dd hh:mm:ss'),
        order_status: 2
      })
    }
  },
  sendOrderCallback: async ({ orderNum }) => {
    // 该订单配送时间已到，完成配送
    const { order_status } = await OrderInfoService.getOrderDetailHelper(orderNum)
    if (order_status === 3) {
      console.log('配送完成', orderNum)
      OrderInfoService.updateOrderDetailHelper(orderNum, {
        complete_time: new Date().formatTime('yyyy-MM-dd hh:mm:ss'),
        order_status: 4
      })
    }
  }
}

module.exports = MQDLXList
