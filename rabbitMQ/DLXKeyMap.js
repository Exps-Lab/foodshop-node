// [note] 死信交换机和要发送信息的routingKey的定义

// 提交订单
const OrderPayDLXKey = {
  DLXExchange: 'orderPayExDLX',
  DLXRoutingKey: 'orderPayMessage'
}

// 送达订单
const SendOrderDLXKey = {
  DLXExchange: 'sendOrderExDLX',
  DLXRoutingKey: 'sendOrderMessage'
}

module.exports = {
  orderPay: OrderPayDLXKey,
  sendOrder: SendOrderDLXKey
}
