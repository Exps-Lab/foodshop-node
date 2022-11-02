const ShopModel = require('../../../model/admin/shop')
const PosBase = require("../../base-class/pos-base")
const ShopBase = require('../../base-class/shop-base')

class HomeService extends PosBase {
  constructor(props) {
    super(props);
    this.shopBase = new ShopBase()
  }

  // 商铺推荐列表
  async shopList (req, res) {
    try {
      const filterData = await this.shopBase.getFilterShopList(req.query)
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

  // 计算路线所需时间
  async getPosCostTimeService (req, res) {
    const [ startLat, startLng ] = req.query.startPos.split(',')
    const endPosGroups = req.query.endPosArr || []
    const timeGroups = []
    for (let i=0; i<endPosGroups.length; i++) {
      const { lat, lng } = JSON.parse(endPosGroups[i])
      const time = await this.getEBicyclingCostTime(`${startLat},${startLng}`, `${lat},${lng}`)
      timeGroups.push(time)
    }
    res.json({
      data: timeGroups
    })
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

  // 获取所有商铺分类
  async getShopCategory (req, res) {
    try {
      const data = await this.shopBase.getShopCategory()
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

  // 获取所有商铺分类
  async getShopSubCategory (req, res) {
    try {
      const { categoryId } = req.query
      const data = await this.shopBase.getShopSubCategory(categoryId)
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

module.exports = new HomeService()
