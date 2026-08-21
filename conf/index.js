const MongoStore = require('connect-mongo')

const CommonConf = {}

// mongoose配置 - 支持环境变量覆盖
CommonConf.mongoose = {
  url: process.env.MONGO_URL || 'mongodb://127.0.0.1:28017/elm_db',
  options: {
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
}

// redis配置 - 支持环境变量覆盖（node-redis v4 格式）
CommonConf.redis = {
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
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
  'h5': {
    secret: 'userSecret',
    resave: true,
    name: 'userSessionId',
    saveUninitialized: false,
    cookie: {
      secure: false,
      // 默认null，浏览器关闭就自动无效
      maxAge: 15 * (24*60*60*1000),
      httpOnly: false,
    },
    store: MongoStore.create({
      mongoUrl: CommonConf.mongoose.url
    })
  },
  'admin': {
    secret: 'adminSecret',
    resave: true,
    name: 'adminSessionId',
    saveUninitialized: false,
    cookie: {
      secure: false,
      // 默认null，浏览器关闭就自动无效
      maxAge: 15 * (24*60*60*1000),
      httpOnly: false,
    },
    store: MongoStore.create({
      mongoUrl: CommonConf.mongoose.url
    })
  }
};

// 七牛云密钥配置 - 支持环境变量覆盖
CommonConf.qiniuConf = {
  bucket: process.env.QINIU_BUCKET || 'elm-dev',
  accessKey: process.env.QINIU_ACCESS_KEY || '',
  secretKey: process.env.QINIU_SECRET_KEY || ''
}

module.exports = CommonConf



