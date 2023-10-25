
/**
 * MQ队列配置
 *
 * 新增：直接配置即可，之后会在index里统一初始化mq实例
 * 支持：目前支持两类ttl的mq实例：
 * 1. 消息队列统一设置过期时间
 * 2. 队列不设置，每次在channel发消息时附加消息的过期时间
 *
 * note: 两种类型在配置时是根据 ExtraConf 配置项的 useQueueExpiredTime 字段区分，默认使用模式1
 */

const { orderPayCallback, sendOrderCallback } = require("./DLXCallbackList")

const MQDLXList = {
  orderPay: {
    DLXKey: 'orderPay',
    ExtraConf: {
      useQueueExpiredTime: true,
      // expiredQueueTime: 15 * 60 * 1000 // 支付超时15分钟后取消订单
      expiredQueueTime: 10 * 1000 // 支付超时15分钟后取消订单
    },
    ConsumerReceivedCB: orderPayCallback,
  },
  sendOrder: {
    DLXKey: 'sendOrder',
    ExtraConf: {
      useQueueExpiredTime: false
    },
    ConsumerReceivedCB: sendOrderCallback
  }
}

module.exports = MQDLXList
