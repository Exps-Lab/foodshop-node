// 消费者

const MQConstruct = require('../index')

// 消费死信交换机推送消息
class OrderPayConsumer extends MQConstruct {
  constructor () {
    super()
    // [note] 获取连接实例
    this.initMQ().then(connection => {
      this.connInstance = connection
      this.initConsumer()
    })
  }

  async initConsumer () {
    // [note] 消费者实际消费的队列，要跟死信交换机绑定
    const consumerQueueName = 'consumerQueue'
    // [note] 获取死信交换机和routingKey命名
    const { DLXExchange, DLXRoutingKey } = this.orderPayDLXKeys

    const channel = await this.connInstance.createChannel()
    await channel.assertExchange(DLXExchange, 'direct', { durable: true });
    const { queue } = await channel.assertQueue(consumerQueueName);

    // [note] 绑定DLX和消费者实际消费的队列
    await channel.bindQueue(queue, DLXExchange, DLXRoutingKey)

    // Listener
    await channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`received time: ${new Date()}`);
        console.log('received data:', msg.content.toString());

        // [note] 消费者发送ack确认收到消息
        channel.ack(msg);
      } else {
        console.log('消费者收取消息失败！');
      }
    });
  }
}

module.exports = new OrderPayConsumer()

