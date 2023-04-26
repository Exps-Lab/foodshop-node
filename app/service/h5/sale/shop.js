const ShopModel = require('../../../model/admin/shop')
const foodCategoryModel = require('../../../model/admin/food-category')
const foodModel = require('../../../model/admin/food')
const PosBase = require("../../base-class/pos-base")
const ShopBase = require('../../base-class/shop-base')
const { shoppingBagPreKey } = require('../../../redis-prekey')
const orderPayProducer = require('../../../../rabbitMQ/orderPay/producer')

class ShopService extends ShopBase {
  constructor(props) {
    super(props);
  }

  // 商铺推荐列表
  async shopList (req, res) {
    try {
      const filterData = await this.getFilterShopList(req.query)
      res.json({
        data: filterData
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  // 模糊搜索商铺和商品
  async shopAndFoodSearch (req, res) {
    try {
      const { name, current_pos } = req.query
      const [ lat, lng ] = current_pos.split(',')
      const data = await ShopModel.aggregate([
        {
          $lookup: {
            from: 'food',
            localField: 'id',
            foreignField: 'shop_id',
            as: 'foods',
          }
        },
        {
          $project: {
            _id: 0,
            __v: 0
          }
        },
      ])
      for (let i = data.length - 1; i >= 0; i--) {
        const item = data[i]
        item.distance = PosBase.getTwoPosDistance(Number(lat), Number(lng), item.pos.lat, item.pos.lng)
        const regExp = new RegExp(name, 'ig')
        if (!regExp.test(item.name)) {
          // 未匹配到店铺，则匹配店铺内的商品
          const isMatch = item.foods.length > 0 && item.foods.some(food => regExp.test(food.name))
          if (!isMatch) {
            data.splice(i, 1)
          }
        }
      }
      data.sort((value1, value2) => value1.distance - value2.distance)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  // 获取所有商铺种类
  async getShopCategoryService (req, res) {
    try {
      const data = await this.getShopCategory()
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  // 获取当前种类对应二级分类
  async getShopSubCategoryService (req, res) {
    try {
      const { categoryId } = req.query
      const data = await this.getShopSubCategory(categoryId)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  // 获取商铺基本信息
  async shopBaseInfoService (req, res) {
    try {
      const { shop_id, current_pos } = req.query
      const shopInfo = await ShopModel.findOne({ id: shop_id }, { admin_uid: 0, _id:0, __v: 0 }).lean(true)
      const [ userLat, userLng ] = current_pos.split(',')
      const { lat, lng } = shopInfo.pos
      shopInfo.send_time = await this.getEBicyclingCostTime(`${userLat},${userLng}`, `${lat},${lng}`) || 0
      res.json({
        data: shopInfo
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  // 商铺关联商品分类以及对应商品的list接口
  async getShopGoodsService (req, res) {
    try {
      const { shop_id } = req.query
      const foodData = await foodCategoryModel.aggregate([
        {
          $match: {
            shop_id
          }
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            shop_id: 0,
            foods: 0
          }
        },
        {
          $lookup: {
            from: 'food',
            localField: 'id',
            foreignField: 'food_category_id',
            as: 'foods',
          }
        },
      ])

      res.json({
        data: foodData
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  // 搜索商铺内商品
  async searchShopGoodsService (req, res) {
    try {
      const { shop_id, keyword = '' } = req.query
      const keywordReg = new RegExp(keyword, 'ig')
      const foodData = await foodModel.aggregate([
        {
          $match: {
            $and: [
              { shop_id },
              {
                $or: [
                  { 'name' : { $regex: keywordReg } },
                  { 'description' : { $regex: keywordReg } },
                  { 'material' : { $regex: keywordReg } },
                ]
              }
            ]
          },
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            admin_uid: 0,
          }
        },
      ])

      res.json({
        data: foodData
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  // 创建临时购物袋
  async addShoppingBagService (req, res) {
    try {
      const { RedisInstance } = _common
      const { u_id } = req.session
      const { shop_id, chose_goods_list } = req.body

      // const ShoppingBagKey = `sale:shoppingBag:${u_id}`
      const { key, expireTime } = shoppingBagPreKey
      const ShoppingBagKey = `${key}:${u_id}`
      const choseGoodsArr = {
        shop_id,
        choseGoods: chose_goods_list
      }
      // 事务处理添加并设置过期时间
      await RedisInstance.set(ShoppingBagKey, choseGoodsArr, expireTime)
      // [test] 发送有效期15分钟的支付消息，超时取消订单
      const mesStr = JSON.stringify({
        name: 'aaa'
      })
      await orderPayProducer.productMessage(mesStr)

      res.json({
        data: ShoppingBagKey
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
}


module.exports = new ShopService()
