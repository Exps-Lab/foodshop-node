
// 提交订单对应死信队列key
const DLXKeyMap = require('./DLXKeyMap')

/**
 * 初始化参数：
 * DLXKey: 死信队列key
 * MQInstance: mq实例
 * ExtraConf
 * {
 *   useQueueExpiredTime: true, 是否统一设置死信队列消息延迟时间，true时expiredQueueTime生效，false时需要在productMessage手动传入
 *   expiredQueueTime: 10 * 1000
 * }
 * ConsumerReceivedCB 消费者自定义回调
 */

class CreateTTLMQ {
  MQParams
  producerChannel = null
  producerExpiredQueue = null
  constructor(props) {
    if (props.MQInstance === null) {
      throw new Error('请先创建mq实例!')
    }
    this.init(props)
  }

  async init (props) {
    await this.setParams(props)
    await this.initConsumer()
    await this.initProducer()
  }

  async setParams (params) {
    const defaultParams = {
      DLXKey: 'orderPay',
      ExtraConf: {
        useQueueExpiredTime: true,
        expiredQueueTime: 10 * 1000
      },
      ConsumerReceivedCB: () => {}
    }
    this.MQParams = Object.assign({}, defaultParams, params)
  }

  // 初始化延时队列消费者
  async initConsumer () {
    const { DLXKey, MQInstance, ConsumerReceivedCB } = this.MQParams

    // [note] 消费者实际消费的队列，要跟死信交换机绑定
    const consumerQueueName = 'consumerQueue_' + DLXKey
    // [note] 获取死信交换机和routingKey命名
    const { DLXExchange, DLXRoutingKey } = DLXKeyMap[DLXKey]
    const channel = await MQInstance.createChannel()
    await channel.assertExchange(DLXExchange, 'direct', { durable: true })
    const { queue } = await channel.assertQueue(consumerQueueName)

    // [note] 绑定DLX和消费者实际消费的队列
    await channel.bindQueue(queue, DLXExchange, DLXRoutingKey)

    // Listener
    await channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`received time: ${new Date()}`)
        // 接收json字符串
        const receiveJsonData = JSON.parse(msg.content.toString())
        ConsumerReceivedCB && typeof ConsumerReceivedCB === 'function' && ConsumerReceivedCB(receiveJsonData)

        // [note] 消费者发送ack确认收到消息
        channel.ack(msg)
      } else {
        console.log('消费者收取消息失败！')
      }
    })
  }

  // 初始化延时队列生产者
  async initProducer () {
    const { DLXKey, MQInstance, ExtraConf } = this.MQParams
    const { useQueueExpiredTime, expiredQueueTime } = ExtraConf

    this.producerChannel = await MQInstance.createChannel()
    // [note] 发送消息使用的消息队列，所有经过此队列发出的消息有效期为15分钟
    const expiredQueueName = 'ttlQueue_' + DLXKey

    // [note] 获取死信交换机和routingKey命名
    const { DLXExchange, DLXRoutingKey } = DLXKeyMap[DLXKey]

    const TTLQueueConf = {
      deadLetterExchange: DLXExchange,
      deadLetterRoutingKey: DLXRoutingKey
    }
    // 是否需要统一设置消息队列的过期时间
    if (useQueueExpiredTime) {
      TTLQueueConf['messageTtl'] = expiredQueueTime
    }
    this.producerExpiredQueue = await this.producerChannel.assertQueue(expiredQueueName, TTLQueueConf)
  }

  // 产出消息
  async productMessage(message = '', delayTime) {
    const { useQueueExpiredTime } = this.MQParams.ExtraConf

    if (this.producerChannel === null || this.producerExpiredQueue === null) {
      throw new Error('Producer初始化失败！')
    }
    const transMessage = typeof message === 'object' ? JSON.stringify(message) : message
    const messageStr = transMessage || `post time: ${new Date()}`

    // 处理发送消息的参数
    const messageParamsArr = [
      this.producerExpiredQueue.queue,
      Buffer.from(messageStr)
    ]
    !useQueueExpiredTime && messageParamsArr.push({
      expiration: String(delayTime)
    })
    await this.producerChannel.sendToQueue(...messageParamsArr)
  }
}

module.exports = CreateTTLMQ
