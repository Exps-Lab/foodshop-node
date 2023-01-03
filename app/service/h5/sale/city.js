const ShopModel = require('../../../model/admin/shop')
const PosBase = require("../../base-class/pos-base")
const CityBase = require('../../../service/base-class/city-base')

class CityService extends CityBase {
  // 获取所有城市
  async getAllCityService (req, res) {
    try {
      const data = await this.getAllCity()
      res.json({
        data: data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '获取城市失败，请重试',
        errLog: err
      })
    }
  }
}

module.exports = new CityService()
