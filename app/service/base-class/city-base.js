const CityModel  = require('../../model/common/city')
const BasePosClass = require('./pos-base')

class cityBase extends BasePosClass {
  /**
   * 获取当前ip定位城市的具体信息
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async getCityInfo (req, res) {
    let cityName = await this.getCityNameFromIp(req)
    let cityPin = _common.CtoPin(cityName)
    let firstLetter = cityPin.charAt(0).toUpperCase()

    try {
      const cityMap = await this.getAllCityData()
      if (cityMap[firstLetter]?.length) {
        let city = cityMap[firstLetter].filter(city => city.pinyin === cityPin)
        res.json({
          data: city[0]
        })
        return
      }
      res.json({
        code: 20002,
        msg: '未找到您的城市'
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }

  /**
   * 获取所有城市
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async getAllCity (req, res) {
    try {
      const cityData = await this.getAllCityData()
      res.json({
        data: cityData
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '获取城市失败，请重试',
        errLog: err
      })
    }
  }

  async getAllCityData () {
    let cities = await CityModel.find({}).lean(true)
    return cities[0].cityData
  }
}

module.exports = cityBase
