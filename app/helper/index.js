const Parameter = require('parameter');

/**
   * 处理业务接口返回
   * @param params 返回参数，具体含义见ResponseParams!
   */
 function handleResponse (params) {
  const { data = '', type = 'success', msg, errMes, errCode, stime } = params;
  const responseConf = {
    success: {
      code: 1,
      msg: msg || 'success',
      data,
      stime: stime || new Date().getTime(),
    },
    failed: {
      code: errCode || 0,
      msg: msg || 'failed',
      data,
      stime: stime || new Date().getTime(),
    },
  };
  if (type === 'failed') {
    // todo  处理错误日志写入
    // this.ctx.logger.error(msg || '[BAD_REQUEST]', errMes);
  }
  return responseConf[type] || {};
}

// 处理时间格式
Date.prototype.formatTime = formatTime;
function formatTime (fmt) {
  let o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

// 验证请求参数
function validate (rule={}, req) {
  const dataOrigin = req.method === 'GET' ? req.query : req.body
  let data = {}
  Object.keys(rule).forEach(props => {
    data[props] = dataOrigin[props]
  });
  if (new Parameter().validate(rule, data) !== undefined) {
    throw new Error(validateResult)
  }
}

module.exports = {
  handleResponse,
  formatTime,
  validate,
} 