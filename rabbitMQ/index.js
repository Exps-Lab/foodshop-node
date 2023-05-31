
const chalk = require('chalk')
const amqplib = require('amqplib');

const OrderPayConsumer = require('./orderPay/cancelConsumer')
const OrderPayProducer = require('./orderPay/producer')

class MQConstruct {
  constructor() {
    this.initMQ()
  }
  static _connInstance = null
  async initMQ () {
    if (MQConstruct._connInstance === null) {
      MQConstruct._connInstance = await this.getConn()
    }

    // 实例暴露到全局
    // global._common._RabbitMQIns = MQConstruct._connInstance
    await this.initConsumers()
  }
  async getConn () {
    return new Promise(resolve => {
      resolve(amqplib.connect('amqp://localhost:5672'))
    }).then(conn => {
      console.log(
        chalk.blue('rabbitMQ连接成功')
      );
      return conn
    })
  }
  // [note]项目启动就开始监听consumer对应交换机消息推送
  async initConsumers () {
    // 提交订单consumer
    new OrderPayConsumer(MQConstruct._connInstance)
    await new OrderPayProducer().initProducer(MQConstruct._connInstance)
  }
}

const RabbitMQIns = new MQConstruct()

module.exports = {
  RabbitMQIns
}
