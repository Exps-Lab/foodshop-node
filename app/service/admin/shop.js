const CityModel  = require('../../model/common/city')
const BasePosClass = require('../base-class/base')

class ShopService extends BasePosClass {
  constructor() {
    super()
  }

  async getCityInfo (req, res) {
    let cityName = await this.getCityNameFromIp(req)
    let cityPin = _common.CtoPin(cityName)
    let firstLetter = cityPin.charAt(0).toUpperCase()

    let cities = await CityModel.find({}).lean(true)
    let cityMap = cities[0].cityData
    if (cityMap[firstLetter]?.length) {
      let city = cityMap[firstLetter].filter(city => city.pinyin === cityPin)
      res.json({
        data: city[0]
      })
      return
    }
    res.json({
      code: 20003,
      data: '',
      msg: '未找到您的城市'
    })
  }

  async searchPlace (req, res) {
    const place = await this.search(req.query)
    let filter = place.map(item => {
      const { title = '', address = '', location } = item
      return {
        title,
        address,
        location
      }
    })
    res.json({
      data: filter
    })
  }
}

module.exports = new ShopService()
