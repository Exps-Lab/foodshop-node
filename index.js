const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const RouterMap = require('./app/router/index')
const middleware = require('./app/middleware')
const { sessionConf } = require('./conf/index')

// 加载全局方法
require('./app/global')
// 加载rabbitMQ配置
require('./rabbitMQ/initMQ')
// 加载数据库配置
require('./mongoDB/index')
// 加载redis配置
require('./redis/index')

// 加载插件
app.use(cookieParser())
app.use('/admin', session(sessionConf['admin']))
app.use('/h5', session(sessionConf['h5']))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 加载中间件
app.use(Object.values(middleware))

// 加载路由模块
RouterMap(app)

app.listen(3000, '0.0.0.0', () => {
  console.log(`Example app listening on port 3000`)
})
