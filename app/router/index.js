// testRouter 路由模块
const testRouter  = require('./test')
const AdminRouter = require('./admin/index')
const H5User = require('./h5/user')
const H5Common = require('./h5/common')

module.exports =  (app)  => {
  // 默认访问
  app.get('/', (req, res, next) => {
    res.json({
      name: 'this is home page'
    })
  })

  app.use('/test', testRouter)
  app.use('/admin', AdminRouter)
  app.use('/h5/user', H5User)
  app.use('/h5/common', H5Common)
}
