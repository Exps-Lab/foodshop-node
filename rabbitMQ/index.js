
const chalk = require('chalk')
const amqplib = require('amqplib');

class MQConstruct {
  constructor() {
    // [note] 死信交换机和要发送信息的routingKey的定义
    this.orderPayDLXKeys = {
      DLXExchange: 'orderPayExDLX',
      DLXRoutingKey: 'orderPayMessage'
    }
  }
  async initMQ () {
    const connInstance = await amqplib.connect('amqp://localhost:5672')
    console.log(
      chalk.blue('rabbitMQ连接成功')
    );
    return connInstance
  }
}

module.exports = MQConstruct
