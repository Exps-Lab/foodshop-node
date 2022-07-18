const CityModel  = require('../../model/common/city')
const CategoryModel  = require('../../model/common/category')
const ShopModel  = require('../../model/admin/shop')
const BasePosClass = require('../base-class/base')

class ShopService extends BasePosClass {
  constructor() {
    super()
  }

  async getCityInfo (req, res) {
    let cityName = await this.getCityNameFromIp(req)
    let cityPin = _common.CtoPin(cityName)
    let firstLetter = cityPin.charAt(0).toUpperCase()

    try {
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
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }

  async searchPlace (req, res) {
    const place = await this.search(req.query)
    let filter = place.data.map(item => {
      const { title = '', address = '', location } = item
      return {
        title,
        address,
        location
      }
    })
    res.json({
      data: {
        total: place.count,
        place: filter
      }
    })
  }

  async getCategory (req, res) {
    try {
      const data = await CategoryModel.find({}, '-_id -__v').lean(true)
      res.json({ data })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }

  async addShop (req, res) {
    const data = req.body
    try {
      await ShopModel.create(data)
      res.json({
        msg: '保存成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }

  async updateShop (req, res) {
    const { id, ...data } = req.body
    try {
      await ShopModel.findOneAndUpdate({ id }, data)
      res.json({
        msg: '保存成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }

  async getDetail (req, res) {
    const { id } = req.query
    try {
      const data = await ShopModel.findOne({ id }, '-_id -__v').lean(true)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
}

module.exports = new ShopService()
