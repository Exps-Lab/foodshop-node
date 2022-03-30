const customLogger = {
  appenders: {
    default: {
      type: 'dateFile',
      filename: 'logs/logs.log',
      pattern: 'yyyy-MM-dd',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy/MM/dd hh:mm:ss} %p %m',
        /* tokens: {
          user: function(logEvent) {
            return AuthLibrary.currentUser();
          }
        } */
      }
    }
  },
  categories: {
    default: {
      appenders: ['default'],
      level: 'debug'
    }
  }
}

module.exports = customLogger


/* const log4js = require("log4js")

log4js.configure({
  appenders: {
    error: {
      type: 'file',           //日志类型
      category: 'errLogger',    //日志名称
      filename: path.join('logs/', 'error/error.log'), //日志输出位置，当目录文件或文件夹不存在时自动创建
      maxLogSize: 104800, // 文件最大存储空间
      backups: 100  //当文件内容超过文件存储空间时，备份文件的数量
    },
    response: {
      type: 'dateFile',
      category: 'resLogger',
      filename: path.join('logs/', 'responses/'),
      pattern: 'yyyy-MM-dd.log', //日志输出模式
      alwaysIncludePattern: true,
      maxLogSize: 104800,
      backups: 100
    }
  },
  categories: {
    error: {appenders: ['error'], level: 'info'},
    response: {appenders: ['response'], level: 'info'},
    default: { appenders: ['response'], level: 'info'}
  },
})
const logger = log4js.getLogger() */