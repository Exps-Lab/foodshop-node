// 处理日志
const { mkdir, stat, appendFile, rename, writeFile, readdir, rm } = require('fs/promises')
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
    this.logPath = config.customLogger.path[type || 'web']
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
    const maxStayDay = 10
    const { level, errMes, errInfo } = data
    const path = join(__dirname, this.logPath)
    const tempFileName = `${path}logs.log`
    const content = `${new Date().formatTime('yyyy-MM-dd hh:mm:ss')}; ${level}: ${errMes} ${errInfo || ''}`

    try {
      await mkdir(path, { recursive: true })
      await stat(tempFileName).then(async todayLogFile => {
        const fileTime = new Date(todayLogFile.birthtimeMs)
        const timeFormat = fileTime.formatTime('yyyy-MM-dd')
        if (new Date().toDateString() === fileTime.toDateString()) {
          await appendFile(tempFileName, `\r\n${content}`)
        } else {
          await readdir(path).then(async dirFile => {
            if (dirFile.length >= maxStayDay) {
              await rm(path + dirFile[dirFile.length -1])
            }
            await rename(tempFileName, `${tempFileName}_${timeFormat}`)
            await writeFile(tempFileName, content)
          })
        }
      }).catch(async (err) => {
        if (err.errno === -2) {
          await writeFile(tempFileName, content)
        }
      })
    } catch  (err) {
      // console.log(err)
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

