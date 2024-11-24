
const ShopService = require('../../../service/h5/sale/shop')

class ShopController {
  // 商铺基本信息
  async shopBaseInfo (req, res) {
    try {
      _common.validate({
        shop_id: {
          type: 'number',
          convertType: 'number',
        },
        current_pos: 'string?'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await ShopService.shopBaseInfoService(req, res)
  }

  // 商铺关联商品分类以及对应商品的list接口
  async getShopGoods (req, res) {
    try {
      _common.validate({
        shop_id: {
          type: 'number',
          convertType: 'number',
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
    await ShopService.getShopGoodsService(req, res)
  }

  // 搜索商铺内商品
  async searchShopGoods (req, res) {
    try {
      _common.validate({
        shop_id: {
          type: 'number',
          convertType: 'number',
        },
        keyword: 'string?'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await ShopService.searchShopGoodsService(req, res)
  }

  // 创建临时购物袋
  async addShoppingBag (req, res) {
    try {
      _common.validate({
        shop_id: {
          type: 'number',
          convertType: 'number',
        },
        chose_goods_list: {
          type: 'array',
          itemType: 'object',
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
    await ShopService.addShoppingBagService(req, res)
  }
}

module.exports = new ShopController()
