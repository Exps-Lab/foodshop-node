// testRouter 路由模块
const testRouter  = require('./test')
const AdminRouter = require('./admin/index')
const H5User = require('./h5/user')
const H5Sale = require('./h5/sale')
const H5Order = require('./h5/order')
const H5Pay = require('./h5/pay')

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
  app.use('/h5/sale', H5Sale)
  app.use('/h5/order', H5Order)
  app.use('/h5/pay', H5Pay)
}
