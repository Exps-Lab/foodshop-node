// testRouter 路由模块
const testRouter  = require('./test')
const AdminRouter = require('./admin/index')
const h5User = require('./h5/user')

module.exports =  (app)  => {
  // 默认访问
  app.get('/', (req, res, next) => {
    res.json({
      name: 'this is home page'
    })
  })

  app.use('/test', testRouter)
  app.use('/admin', AdminRouter)
  app.use('/h5/user', h5User)
}
