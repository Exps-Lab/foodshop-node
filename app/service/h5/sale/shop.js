const ShopModel = require('../../../model/admin/shop')
const PosBase = require("../../base-class/pos-base")
const ShopBase = require('../../base-class/shop-base')

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
}

module.exports = new ShopService()
