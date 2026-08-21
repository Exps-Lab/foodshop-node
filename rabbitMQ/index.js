
const chalk = require('chalk')
const amqplib = require('amqplib');

const MQDLXList = require('./DLXList')
const CreateTTLMQ = require('./createTTLMQ')

class MQConstruct {
  #connInstance = null
  mqInstanceMap = {}
  constructor() {
    this.initMQ()
  }
  async initMQ () {
    if (this.#connInstance === null) {
      this.#connInstance = await this.getConn()
    }

    await this.registerMQ()
  }
  async getConn () {
    const rabbitmqUser = process.env.RABBITMQ_DEFAULT_USER || 'guest'
    const rabbitmqPass = process.env.RABBITMQ_DEFAULT_PASS || 'guest'
    const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost'
    const rabbitmqPort = process.env.RABBITMQ_PORT || '5672'
    const rabbitmqUrl = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}`
    
    return new Promise(resolve => {
      resolve(amqplib.connect(rabbitmqUrl))
    }).then(conn => {
      console.log(
        chalk.blue('rabbitMQ连接成功')
      );
      return conn
    }).catch(error => {
      console.log("rabbitMQ连接报错：" + error)
    })
  }

  // 注册所有的mq
  async registerMQ () {
    Object.keys(MQDLXList).forEach(mqKey => {
      const mqConf = MQDLXList[mqKey]
      mqConf.MQInstance = this.#connInstance

      this.mqInstanceMap[mqKey] = new CreateTTLMQ(mqConf)
    })
  }

  // 获取某个mq实例，便于发送mq消息
  getMQIns (mqKey) {
    if (!mqKey) {
      throw new Error('请传入要获取的mqKey值')
    }
    return this.mqInstanceMap[mqKey] || null
  }
}

const RabbitMQIns = new MQConstruct()
// 方法绑定全局
global._common.getMQInstance = RabbitMQIns.getMQIns.bind(RabbitMQIns)

module.exports = {
  getMQInstance: RabbitMQIns.getMQIns
}
