
const ShopService = require('../../../service/h5/sale/shop')

class HomeController {
  // 商铺推荐列表
  async shopList (req, res) {
    try {
      _common.validate({
        page_num: {
          type: 'number',
          required: false,
          convertType: 'number'
        },
        page_size: {
          type: 'number',
          required: false,
          convertType: 'number'
        },
        distance: {
          type: 'number',
          convertType: 'number',
        },
        current_pos: 'string?',
        shop_type: 'string?',
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await ShopService.shopList(req, res)
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
    await ShopService.shopAndFoodSearch(req, res)
  }

  async getCategory (req, res) {
    await ShopService.getShopCategoryService(req, res)
  }

  async getSubCategory (req, res) {
    try {
      _common.validate({
        categoryId: 'string'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }

    await ShopService.getShopSubCategoryService(req, res)
  }
}

module.exports = new HomeController()
