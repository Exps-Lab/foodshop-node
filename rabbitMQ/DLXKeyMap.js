// [note] 死信交换机和要发送信息的routingKey的定义

// 提交订单
const OrderDLXKey = {
  DLXExchange: 'orderPayExDLX',
  DLXRoutingKey: 'orderPayMessage'
}

module.exports = {
  ...OrderDLXKey
}
