const HomeService = require('../../../service/h5/common/home')

class HomeController {
  // 商铺推荐列表
  async shopList (req, res) {
    try {
      _common.validate({
        current_pos: 'string'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return  
    }
    await HomeService.homeList(req, res)
  }
  
  // 商铺或商品模糊查询
  async shopAndFoodSearch (req, res) {
    try {
      _common.validate({
        name: 'string',
        current_pos: 'string'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return  
    }
    await HomeService.shopAndFoodSearch(req, res)
  }
}

module.exports = new HomeController()