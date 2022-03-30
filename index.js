const express = require('express')
const app = express()
const RouterMap  =  require('./app/router/index')
const { handleErr,  handleCros, handleReqLog } = require('./app/middleware')
require('./mongoDB/index')
// 加载全局方法
require('./app/global')

// 加载中间件
app.use(handleCros)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(handleErr)
app.use(handleReqLog)

// 加载路由模块
RouterMap(app)

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
