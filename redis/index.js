const redis = require('redis')
const chalk = require('chalk')
const config = require('../conf/index')
const redisConf = config.redis

class Redis {
  constructor() {
    this.redisClient = null
    this.init()
  }
  init () {
    this.redisClient = redis.createClient(redisConf)
    this.redisClient.connect()

    this.redisClient.on('ready', function () {
      console.log(
        chalk.cyan('redis is ready')
      );
      _common.WebLogger.info('[redis]', 'redis is ready');
    })
    this.redisClient.on('error', function (error) {
      console.error(
        chalk.red('Error in redis: ' + error)
      );
      _common.WebLogger.error('[redis]', error);
    })
  }
  // 设置获取时间
  async setExpire (key, expires) {
    if (!key || !expires) {
      return 'expire必须的'
    }
    if (typeof expires !== 'number') {
      return 'expires必须为number'
    }
    try {
      return await this.redisClient.expire(key, expires)
    } catch (err) {
      return err
    }
  }
  // 如果key已经存储其他值，SET会覆盖旧值，且无视类型
  async set (key, value, expires) {
    if (!key) {
      return 'key必须的'
    }
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    try {
      await this.redisClient.set(key, value)
      return await this.setExpire(key, expires)
    } catch (err) {
      return err
    }
  }
  async get (key) {
    if (!key) {
      return 'key必须的'
    }
    try {
      return await this.redisClient.get(key)
    } catch (err) {
      return err
    }
  }
  async del (key) {
    if (!key) {
      return 'key必须的'
    }
    try {
      return await this.redisClient.del(key)
    } catch (err) {
      return err
    }
  }
  async exit (key) {
    if (!key) {
      return 'key必须的'
    }
    try {
      return await this.redisClient.exists(key)
    } catch (err) {
      return err
    }
  }
  // 设置hash类型值
  // 支持field为map模式（直接存储一个对象，不用传具体设置的value）
  async hSet (key, field, value, expires) {
    if (!key || !field) {
      return 'key和field必须的'
    }
    try {
      await this.redisClient.hSet(key, field, value)
      return await this.setExpire(key, expires)
    } catch (err) {
      return err
    }
  }
  // hash 获取单独value
  async hGet (key, field) {
    if (!key || !field) {
      return 'key和field必须的'
    }
    try {
      return await this.redisClient.hGet(key, field)
    } catch (err) {
      return err
    }
  }
  // hash获取所有值
  async hGetAll (key) {
    if (!key) {
      return 'key必须的'
    }
    try {
      return await this.redisClient.hGetAll(key)
    } catch (err) {
      return err
    }
  }
  // hash删除
  async hDel (key, field) {
    if (!key || !field) {
      return 'key和field必须的'
    }
    try {
      return await this.redisClient.hDel(key, field)
    } catch (err) {
      return err
    }
  }
}

// 初始化redis
const RedisInstance = new Redis()

/**
 * @type {{redisInstance: Redis, redisClient: null}}
 * redisInstance 封装的redis对象，包含一些实现的方法
 * redisClient   原生redis连接实例，如果redisInstance自己封装的方法不满足业务，可以直接用原生的原子方法处理
 */
module.exports = {
  RedisInstance,
  RedisClient: RedisInstance.redisClient
}

