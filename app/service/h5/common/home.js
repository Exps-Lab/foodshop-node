const ShopModel = require('../../../model/admin/shop')

class HomeService {
  async homeList (req, res) {
    try {
      const [ lat, lng ] = req.query.current_pos.split(',')
      let data = await ShopModel.find().lean(true)
      for (const item of data) {
        item.distance = _common.getTwoPosDistance(Number(lat), Number(lng), item.pos.lat, item.pos.lng)
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
        item.distance = _common.getTwoPosDistance(Number(lat), Number(lng), item.pos.lat, item.pos.lng)
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
}

module.exports = new HomeService()