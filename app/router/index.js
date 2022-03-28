// testRouter 路由模块
const testRouter  = require('./test')

module.exports =  (app)  => {
  // 默认访问
  app.get('/', (req, res, next) => {
    res.json({
      name: 'this is home page'
    })
  })
  
  app.use('/test', testRouter)
}