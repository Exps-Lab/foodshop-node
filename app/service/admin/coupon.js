const CouponModel = require('../../model/common/coupon')

class CouponService {
  /**
   * 获取优惠券列表（分页）
   * @param {Object} req
   * @param {Object} res
   */
  async getCouponList (req, res) {
    const { page_num = 1, page_size = 10 } = req.query
    const filterConf = '-_id -__v'

    try {
      const list = await CouponModel.find({}, filterConf)
        .skip((Number(page_num) - 1) * Number(page_size))
        .limit(Number(page_size))
        .sort({ coupon_id: -1 })
        .lean(true)

      const total = await CouponModel.find({}).countDocuments()

      // 创建人、更新人字段兜底
      list.forEach(item => {
        item.create_user = item.create_user
        item.update_user = item.update_user
        item.valid_start = item.valid_start.formatTime('yyyy-MM-dd hh:mm:ss')
        item.valid_end = item.valid_end.formatTime('yyyy-MM-dd hh:mm:ss')
      })

      res.json({
        data: {
          list,
          page_num: Number(page_num),
          page_size: Number(page_size),
          total,
          hasNext: total > Number(page_num) * Number(page_size)
        }
      })
    } catch (err) {
      _common.WebLogger.error('获取优惠券列表失败', err)
      res.json({
        code: 20002,
        msg: '获取优惠券列表失败',
        errLog: err
      })
    }
  }

  /**
   * 获取优惠券详情
   * @param {Object} req
   * @param {Object} res
   */
  async getCouponDetail (req, res) {
    const { coupon_id } = req.query
    const filterConf = '-_id -__v'

    try {
      const data = await CouponModel.findOne({ coupon_id: Number(coupon_id) }, filterConf).lean(true)
      if (!data) {
        res.json({ code: 20002, msg: '优惠券不存在' })
        return
      }
      res.json({ data })
    } catch (err) {
      _common.WebLogger.error('获取优惠券详情失败', err)
      res.json({
        code: 20002,
        msg: '获取优惠券详情失败',
        errLog: err
      })
    }
  }

  /**
   * 新增优惠券
   * @param {Object} req
   * @param {Object} res
   */
  async addCoupon (req, res) {
    const { title, base_val, valid_start, valid_end } = req.body
    const now = Date.now()
    const create_user = req.session.username
    const doc = new CouponModel({
      title,
      base_val,
      valid_start: new Date(valid_start), // 前端 timestamp 为毫秒级
      valid_end: new Date(valid_end),
      create_user,
      update_user: '暂无',
      c_time: now,
      update_time: -1
    })

    try {
      await doc.save()
      res.json({ data: doc })
    } catch (err) {
      _common.WebLogger.error('新增优惠券失败', err)
      res.json({
        code: 20002,
        msg: '新增优惠券失败',
        errLog: err
      })
    }
  }

  /**
   * 更新优惠券
   * @param {Object} req
   * @param {Object} res
   */
  async updateCoupon (req, res) {
    const { coupon_id, ...data } = req.body
    const update_user = req.session.username || '暂无'

    try {
      const setData = { ...data, update_user, update_time: Date.now() }
      if (data.valid_start) setData.valid_start = new Date(data.valid_start) // 毫秒级
      if (data.valid_end) setData.valid_end = new Date(data.valid_end)

      await CouponModel.updateOne(
        { coupon_id: Number(coupon_id) },
        { $set: setData }
      )
      res.json({ data: true })
    } catch (err) {
      _common.WebLogger.error('更新优惠券失败', err)
      res.json({
        code: 20002,
        msg: '更新优惠券失败',
        errLog: err
      })
    }
  }

  /**
   * 删除优惠券
   * @param {Object} req
   * @param {Object} res
   */
  async deleteCoupon (req, res) {
    const { coupon_id } = req.body

    try {
      await CouponModel.deleteOne({ coupon_id: Number(coupon_id) })
      res.json({ data: true })
    } catch (err) {
      _common.WebLogger.error('删除优惠券失败', err)
      res.json({
        code: 20002,
        msg: '删除优惠券失败',
        errLog: err
      })
    }
  }
}

module.exports = new CouponService()
