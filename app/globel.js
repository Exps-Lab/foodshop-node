const log4js = require("log4js")
const helperFun = require('./helper/index')
const customLogger = require('./logConfig')

/* 日志格式配置 */
log4js.configure(customLogger)
const logger = log4js.getLogger()

global._ctx = {
  ...helperFun,
  logger
}
