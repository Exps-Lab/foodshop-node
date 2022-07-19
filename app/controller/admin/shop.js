const ShopService = require('../../service/admin/shop')


class ShopController {
  constructor() {}

  // 商铺详情验证rule
  static paramsRules = {
    name: 'string',
    address: 'string',
    pos: {
      type: 'object',
      rule: {
        lat: 'number',
        lng: 'number'
      }
    },
    phone: 'string',
    intro_text: 'string',
    shop_mark: 'string',
    category: {
      type: 'array',
      itemType: 'string'
    },
    delivery_fee: 'number',
    mini_delivery_price: 'number',
    open_time: {
      type: 'array',
      itemType: 'string'
    },
    shop_image: {
      type: 'object',
      rule: {
        avatar: 'string',
        business_licence: 'string',
        food_licence: 'string'
      }
    }
  }

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
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await ShopService.searchPlace(req, res)
  }

  async getCategory (req, res) {
    await ShopService.getCategory(req, res)
  }

  async addShop (req, res) {
    try {
      if (!req.body?.pos?.lat || !req.body?.pos?.lng) {
        res.json({
          code: 20003,
          msg: '没有定位信息，请重新选择店铺地址!',
          errLog: '没有定位pos信息',
        })
        return false
      }
      _common.validate(ShopController.paramsRules, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await ShopService.addShop(req, res)
  }

  async updateShop (req, res) {
    try {
      _common.validate({
        id: {
          type: 'number',
          covertType: 'number'
        },
        ...ShopController.paramsRules
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await ShopService.updateShop(req, res)
  }

  async getDetail (req, res) {
    try {
      _common.validate({
        id: 'id'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await ShopService.getDetail(req, res)
  }

  async shopList (req, res) {
    try {
      _common.validate({
        pn: {
          type: 'number',
          required: false,
          convertType: 'number'
        },
        rn: {
          type: 'number',
          required: false,
          convertType: 'number'
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await ShopService.shopList(req, res)
  }

  async deleteShop (req,res) {
    try {
      _common.validate({
        id: {
          type: 'number',
          convertType: 'number'
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await ShopService.deleteShop(req, res)
  }
}


module.exports = new ShopController()
