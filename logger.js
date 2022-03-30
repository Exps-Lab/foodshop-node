// 处理日志
const { promises } = require('fs')
const { join } = require('path')
const config = require('./conf/index')

class Logger {
  static Level = {
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR',
  }
  constructor(type) {
    this.logPath = config.logger[type || 'web']
  }
  debug (errMes, errInfo) {
    this.writeLog({
      level: Logger.Level.debug,
      errMes,
      errInfo,
    })
  }
  info (errMes, errInfo) {
    this.writeLog({
      level: Logger.Level.info,
      errMes,
      errInfo,
    })
  }
  warn (errMes, errInfo) {
    this.writeLog({
      level: Logger.Level.warn,
      errMes,
      errInfo,
    })
  }
  error (errMes, errInfo) {
    this.writeLog({
      level: Logger.Level.error,
      errMes,
      errInfo,
    })
  }
  async writeLog (data) {
    const { level, errMes, errInfo } = data
    const path = join(__dirname, this.logPath)
    const tempFileName = `${path}logs.log`
    const content = `${new Date().formatTime('yyyy-MM-dd hh:mm:ss')}; ${level}: ${errMes} ${errInfo || ''}`

    // todo 上限删除
    try {
      await promises.mkdir(path, { recursive: true })
      await promises.stat(tempFileName).then(async (todayLogFile) => {
        const fileTime = new Date(todayLogFile.ctimeMs)
        const timeFormat = fileTime.formatTime('yyyy-MM-dd')
        if (new Date().toDateString === fileTime.toDateString) {
          await promises.appendFile(tempFileName, `\r\n${content}`)
        } else {
          await promises.rename(tempFileName, `${tempFileName}_${timeFormat}`)
          await promises.writeFile(tempFileName, content)
        }
      }).catch(async (err) => {
        if (err.errno === -2) {
          await promises.writeFile(tempFileName, content)
        }
      })
    } catch  (err) {
      console.log(err)
      throw new Error(err)
    }
  }
}

// web日志
class WebLogger  extends Logger {
  constructor () {
    super('web')
  }
}

// app启动运行日志
class AppLogger  extends Logger {
  constructor () {
    super('app')
  }
}

// DB启动运行日志
class DBLogger  extends Logger {
  constructor () {
    super('db')
  }
}

module.exports = {
  WebLogger: new WebLogger(),
  AppLogger:  new AppLogger(),
  DBLogger: new DBLogger()
}

