// 消费者
const OrderInfoService = require("../../app/service/h5/order/info")

// 提交订单对应死信队列key
const OrderDLXKey = require('../DLXKeyMap')

// 消费死信交换机推送消息
class OrderPayConsumer {
  constructor (mqInstance) {
    // [note] 获取连接实例
    this.connInstance = mqInstance
    this.initConsumer()
  }

  async initConsumer () {
    // [note] 消费者实际消费的队列，要跟死信交换机绑定
    const consumerQueueName = 'consumerQueue'
    // [note] 获取死信交换机和routingKey命名
    const { DLXExchange, DLXRoutingKey } = OrderDLXKey

    const channel = await this.connInstance.createChannel()
    await channel.assertExchange(DLXExchange, 'direct', { durable: true })
    const { queue } = await channel.assertQueue(consumerQueueName)

    // [note] 绑定DLX和消费者实际消费的队列
    await channel.bindQueue(queue, DLXExchange, DLXRoutingKey)

    // Listener
    await channel.consume(queue, async (msg) => {
      if (msg !== null) {
        console.log(`received time: ${new Date()}`)
        // 接收json字符串
        const { orderNum } = JSON.parse(msg.content.toString())
        // [note] 消费者发送ack确认收到消息
        channel.ack(msg)
        // 该订单若超时未支付，则取消订单
        const { order_status } = await OrderInfoService.getOrderDetailHelper(orderNum)
        if (order_status === 0) {
          console.log('超时取消', orderNum)
          OrderInfoService.updateOrderDetailHelper(orderNum, {
            cancel_time: new Date().formatTime('yyyy-MM-dd hh:mm:ss'),
            order_status: 2
          })
        } else if (order_status === 3) {
          // 订单配送完成
          OrderInfoService.updateOrderDetailHelper(orderNum, {
            complete_time: new Date().formatTime('yyyy-MM-dd hh:mm:ss'),
            order_status: 4
          })
        }
      } else {
        console.log('消费者收取消息失败！')
      }
    })
  }
}

module.exports = OrderPayConsumer

