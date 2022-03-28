
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

module.exports = {
  handleResponse
} 