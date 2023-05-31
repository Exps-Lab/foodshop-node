// 生产者

// 提交订单对应死信队列key
const OrderDLXKey = require('../DLXKeyMap')

// 目前处理生成订单超时未支付自动取消订单的场景
// 利用队列的ttl属性（消息有效期）和死信死信交换机处理
class OrderPayProducer {
  static channel = null
  static expiredQueue = null

  async initProducer (mqInstance) {
    OrderPayProducer.channel = await mqInstance.createChannel()

    // [note] 发送消息使用的消息队列，所有经过此队列发出的消息有效期为15分钟
    const expiredQueueName = 'ttlQueue'
    const queueExpired = 20 * 1000

    // [note] 获取死信交换机和routingKey命名
    const { DLXExchange, DLXRoutingKey } = OrderDLXKey

    OrderPayProducer.expiredQueue = await OrderPayProducer.channel.assertQueue(expiredQueueName, {
      messageTtl: queueExpired,
      deadLetterExchange: DLXExchange,
      deadLetterRoutingKey: DLXRoutingKey
    });
  }
  // 产出消息
  async productMessage(message = '') {
    const { channel, expiredQueue } = OrderPayProducer
    const transMessage = typeof message === 'object' ? JSON.stringify(message) : message
    const messageStr = transMessage || `post time: ${new Date()}`
    await channel.sendToQueue(expiredQueue.queue, Buffer.from(messageStr))
  }
}

module.exports = OrderPayProducer
