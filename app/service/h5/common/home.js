const ShopModel = require('../../../model/admin/shop')
const PosBase = require("../../base-class/pos-base")

class HomeService extends PosBase {
  // 首页推荐列表
  async homeList (req, res) {
    try {
      const [ lat, lng ] = req.query.current_pos.split(',')
      let data = await ShopModel.find().lean(true)
      for (const item of data) {
        item.distance = PosBase.getTwoPosDistance(Number(lat), Number(lng), item.pos.lat, item.pos.lng)
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

  // 计算路线所需时间 [note]控制并发版本
  // async handleCostGroups (startPos, endPosGroups) {
  //   let count = 0
  //   let resTime = []
  //   const maxRequest = 10
  //   const { lat, lng } = startPos
  //   const endGroupLen = endPosGroups.length
  //   const min = Math.min(endGroupLen, maxRequest)
  //   const copyEndPos = JSON.parse(JSON.stringify(endPosGroups))
  //
  //   const calcTime = async (endPos) => {
  //     if (endPos) {
  //       const {lat: endLat, lng: endLng} = endPos.pos
  //       resTime.push(await this.getEBicyclingCostTime(`${Number(lat)},${Number(lng)}`, `${endLat},${endLng}`))
  //       count++
  //       if (count >= endGroupLen) {
  //         return resTime
  //       } else {
  //         copyEndPos.length && await calcTime(copyEndPos.shift())
  //       }
  //     }
  //   }
  //
  //   for (let i=0; i<min; i++) {
  //     await calcTime(copyEndPos.shift())
  //   }
  //
  //   for (let i=0; i<endGroupLen; i++) {
  //     endPosGroups[i].costTime = resTime[i]
  //   }
  // }

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
}

module.exports = new HomeService()
