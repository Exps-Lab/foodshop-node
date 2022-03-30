const CommonConf = require('../../conf/index')

const handleLog = async (req, res, next) => {
  req.__request_time__ = Date.now()
  await next()
  req.__response_time__ = Date.now()
  const appLog = CommonConf.customLogger.appLogger.formatter(req)
  _common.AppLogger.info(appLog)
}

module.exports  = handleLog