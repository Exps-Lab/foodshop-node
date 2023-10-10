// MQ队列配置
// 需要新增直接配置即可，之后会在index里统一初始化mq实例

const MQDLXList = {
  orderPay: {
    DLXKey: 'orderPay',
    ExtraConf: {
      useQueueExpiredTime: true,
      expiredQueueTime: 10 * 1000
    },
    ConsumerReceivedCB: (data) => {
      console.log('data____', data)
    }
  },
  sendOrder: {
    DLXKey: 'sendOrder',
    ExtraConf: {
      useQueueExpiredTime: false
    },
    ConsumerReceivedCB: (data) => {
      console.log('datas____', data)
    }
  }
}

module.exports = MQDLXList
