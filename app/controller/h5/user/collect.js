const UserCollectService = require('../../../service/h5/user/collect')

class UserCollectController {
  async addCollectShop (req, res) {
    try {
      _common.validate({
        shop_id: {
          type: 'number',
          convertType: 'number',
          required: true
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await UserCollectService.addCollectShop(req, res)
  }
  async removeCollectShop (req, res) {
    try {
      _common.validate({
        shop_id: {
          type: 'number',
          convertType: 'number',
          required: true
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await UserCollectService.removeCollectShop(req, res)
  }
  async getCollectShopList (req, res) {
    try {
      _common.validate({
        pageNum: {
          type: 'number',
          convertType: 'number',
          required: true
        },
        pageSize: {
          type: 'number?',
          convertType: 'number'
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await UserCollectService.getCollectList(req, res)
  }
}

module.exports = new UserCollectController()
