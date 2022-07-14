const ShopService = require('../../service/admin/shop')

class ShopController {
  async getCityInfo (req, res) {
    await ShopService.getCityInfo(req, res)
  }
  async searchPlace (req, res) {
    try {
      _common.validate({
        keyword: 'string',
        city_name: 'string'
      }, req)
    } catch (err) {
      console.log(err)
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await ShopService.searchPlace(req, res)
  }
}

module.exports = new ShopController()
