const redis = require('redis')
const chalk = require('chalk')
const config = require('../conf/index')
const redisConf = config.redis

// init
const redisClient = redis.createClient(redisConf)
redisClient.connect()

redisClient.on('ready', function (error) {
  console.log(
    chalk.cyan('redis is ready')
  );
})

redisClient.on('error', function (error) {
  console.error(
    chalk.red('Error in redis: ' + error)
  );
})

module.exports = redisClient

