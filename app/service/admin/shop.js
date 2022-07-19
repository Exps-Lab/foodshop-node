const CityModel  = require('../../model/common/city')
const CategoryModel  = require('../../model/common/category')
const ShopModel  = require('../../model/admin/shop')
const BasePosClass = require('../base-class/pos-base')

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
        msg: err,
        errLog: err
      })
    }
  }

  async shopList (req, res) {
    const { rn = 10, pn = 1 } = req.query
    const admin_uid = req.session.admin_uid
    const queryObj = await this.getQueryFromUser('admin_user', 'u_id', 'admin_uid', admin_uid)

    try {
      let shopData = await ShopModel.find(queryObj, '-_id -__v').sort('-id').skip((pn-1) * rn).limit(rn)
      let count = await ShopModel.find(queryObj).count()
      res.json({
        data: {
          list: shopData,
          total: count,
          pn,
          rn
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  async addShop (req, res) {
    const admin_uid = req.session.admin_uid
    const data = req.body
    data.admin_uid = admin_uid
    try {
      await ShopModel.create(data)
      res.json({
        msg: '保存成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
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
        msg: err,
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
        msg: err,
        errLog: err
      })
    }
  }

  async deleteShop (req, res) {
    const { id } = req.body
    try {
      await ShopModel.findOneAndDelete({ id })
      res.json({
        msg: '删除成功'
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
