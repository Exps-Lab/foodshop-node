const ShopModel  = require('../../model/admin/shop')
const { getQueryFromUser } = require('./common')
const BasePosClass = require('../base-class/pos-base')

class ShopService extends BasePosClass {
  constructor() {
    super()
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

  async shopList (req, res) {
    const { rn = 10, pn = 1 } = req.query
    const u_id = req.session.u_id
    const queryObj = await getQueryFromUser('u_id', u_id)

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
    const u_id = req.session.u_id
    const data = req.body
    data.u_id = u_id
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
