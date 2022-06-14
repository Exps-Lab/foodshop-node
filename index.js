const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const RouterMap = require('./app/router/index')
const { handleCros, handleSession, handleReqLog } = require('./app/middleware')
const { sessionConf } = require('./conf/index')

// 加载数据库配置
require('./mongoDB/index')
// 加载全局方法
require('./app/global')

// 加载中间件
app.use(cookieParser())
app.use('/admin', session(sessionConf.admin))
app.use('/main-user', session(sessionConf.user))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(handleCros)
app.use(handleSession)
app.use(handleReqLog)

// 加载路由模块
RouterMap(app)

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
