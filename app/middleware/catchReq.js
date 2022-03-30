// 缓存最新的请求信息

const handleCatchReq = (req, res, next) => {
  // CommonConf.customLogger
  // const { host, port, url, method } = req;
  /* const startTime = req?.state?.__request_time__;
  const endTime = req?.state?.__response_time__ || +new Date();
  const duration = endTime - startTime;
  const log = JSON.stringify({
    timestamp: new Date().toLocaleString(),
    app: req.app.name,
    level: '',
    thread: '',
    logger: '',
    class: '',
    line: '',
    req_id: '',
    req_url: req.url,
    req_ip: req.ip,
    req_body: req.body,
    req_params: req.query,
    req_method: req.method,
    // msg: meta.message,
    ex: '',
    startTime,
    during: duration,
    // paddingMessage: meta.paddingMessage,
    // trace_id: req?.get('X-TraceId'),
  }); */
  console.log('CatchReq:', log)
  global._ctx.catchReq = log;
  next();
}

module.exports  = handleCatchReq