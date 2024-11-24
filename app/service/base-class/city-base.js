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
        return cityMap[firstLetter].filter(city => city.pinyin === cityPin)[0]
      }
      return null
    } catch (err) {
      throw new Error(err)
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
      return await this.getAllCityData() || {}
    } catch (err) {
      throw new Error(err)
    }
  }

  async getAllCityData () {
    let cities = await CityModel.find({}).lean(true)
    return cities[0].cityData
  }
}

module.exports = cityBase
