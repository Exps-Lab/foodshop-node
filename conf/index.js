const CommonConf = {}

// mongoose配置
CommonConf.mongoose = {
  url: 'mongodb://127.0.0.1:27017/localTest',
  options: {
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
};

// logger配置
CommonConf.appLogger = {
  reqLogger: {
    file: path.join(appInfo.root, 'logs/nova.log'),
    formatter(meta) {
      const startTime = meta.ctx?.state?.__request_time__ || meta.date;
      const endTime = meta.ctx?.state?.__response_time__ || Date.now();
      const duration = endTime - startTime;
      const log = JSON.stringify({
        timestamp: new Date().toLocaleString(),
        app: meta.ctx.app.name,
        level: '',
        thread: '',
        logger: '',
        class: '',
        line: '',
        req_id: '',
        req_url: meta.ctx.request.url,
        req_ip: meta.ctx.ip,
        req_body: meta.ctx.request.body,
        req_params: meta.ctx.query,
        req_method: meta.ctx.request.method,
        msg: meta.message,
        ex: '',
        startTime,
        during: duration,
        paddingMessage: meta.paddingMessage,
        trace_id: meta.ctx?.get('X-TraceId'),
      });
      return log;
    },
  }
};

module.exports = CommonConf



