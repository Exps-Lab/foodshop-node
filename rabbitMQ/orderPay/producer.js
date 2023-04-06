// 生产者

const MQConstruct = require('../index')

// 目前处理生成订单超时未支付自动取消订单的场景
// 利用队列的ttl属性（消息有效期）和死信死信交换机处理
class OrderPayProducer extends MQConstruct {
  constructor() {
    super()
    // [note] 获取连接实例
    this.initMQ().then(connection => {
      this.connInstance = connection
      this.initProducer()
    })
    this.channel = null
    this.expiredQueue = null
  }
  async initProducer () {
    this.channel = await this.connInstance.createChannel()

    // [note] 发送消息使用的消息队列，所有经过此队列发出的消息有效期为15分钟
    const expiredQueueName = 'ttlQueue'
    const queueExpired = 20 * 1000

    // [note] 获取死信交换机和routingKey命名
    const { DLXExchange, DLXRoutingKey } = this.orderPayDLXKeys

    this.expiredQueue = await this.channel.assertQueue(expiredQueueName, {
      messageTtl: queueExpired,
      deadLetterExchange: DLXExchange,
      deadLetterRoutingKey: DLXRoutingKey
    });
  }
  // 产出消息
  async productMessage(message = '') {
    const messageStr = message || `post time: ${new Date()}`
    await this.channel.sendToQueue(this.expiredQueue.queue, Buffer.from(messageStr))
  }
}

module.exports = new OrderPayProducer()
