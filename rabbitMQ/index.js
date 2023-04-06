
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
  static connInstance = null
  async initMQ () {
    if (MQConstruct.connInstance === null) {
      MQConstruct.connInstance = new Promise(resolve => {
        resolve(amqplib.connect('amqp://localhost:5672'))
      }).then(conn => {
        console.log(
          chalk.blue('rabbitMQ连接成功')
        );
        return conn
      })
    }
    return MQConstruct.connInstance
  }
}

module.exports = MQConstruct
