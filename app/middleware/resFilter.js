const CommonConf = require('../../conf/index')

const handleReqLog = async (req, res, next) => {
  req.__request_time__ = Date.now()
  await next()
  req.__response_time__ = Date.now()
  const appLog = CommonConf.customLogger.appLogger.formatter(req)
  _common.AppLogger.info(appLog)
}

/**
 * 处理业务接口返回
 * @param {*} params 业务返回参数，code默认不传或等于1为请求成功，否则为请求失败
 */
const handleResponse = (req, res, next) => {
  const _send = res.json
  res.json = function (params) {
    const { code = 1, data = null, msg, errLog } = params
    if (code === 1) {
      // 请求成功响应
      params = {
        code: 1,
        msg: msg || 'success',
        data,
        stime: new Date().getTime()
      }
    } else {
      // 请求失败响应
      params = {
        code: code,
        msg: msg || 'failed',
        data,
        stime: new Date().getTime()
      }
      // 处理错误日志写入
      _common.WebLogger.error(msg || '[BAD_REQUEST]', errLog);
    }
    _send.call(res, params)
  }
  next()
}

module.exports = { handleReqLog, handleResponse }