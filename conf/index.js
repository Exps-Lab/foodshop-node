const MongoStore = require('connect-mongo')

const CommonConf = {}

// mongoose配置
CommonConf.mongoose = {
  url: 'mongodb://127.0.0.1:27017/elm_db',
  options: {
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
}

// logger配置
CommonConf.customLogger = {
  path: {
    web: './logs/web/',
    app: './logs/app/',
    db:  './logs/db/'
  },
  appLogger: {
    formatter(meta) {
      const startTime = meta.__request_time__
      const endTime = meta.__response_time__
      const log = JSON.stringify({
        timestamp: new Date().toLocaleString(),
        app: meta.app.name,
        level: '',
        thread: '',
        logger: '',
        class: '',
        line: '',
        req_id: '',
        req_url: meta.originalUrl,
        req_ip: meta.ip,
        req_body: meta.body,
        req_params: meta.query,
        req_method: meta.method,
        msg: meta.message,
        ex: '',
        startTime,
        during: endTime - startTime,
        paddingMessage: meta.paddingMessage,
        // trace_id: meta.get('X-TraceId'),
      })
      return log
    },
  }
};

// session配置
CommonConf.sessionConf = {
  secret: 'mySecret',
  saveUninitialized: true,
  name: 'userSessionId',
  cookie: {
    secure: false,
    // 默认null，浏览器关闭就自动无效
    maxAge: 50 * 1000,
  },
  store: MongoStore.create({
    mongoUrl: CommonConf.mongoose.url
  })
};

module.exports = CommonConf



