const CouponModel = require('../../../model/common/coupon')
const UserModel = require('../../../model/h5/user/login')

class CouponService {
  /**
   * 用户领取优惠券（写入 user.coupon_ids，逗号分隔）
   * @param {Object} req
   * @param {Object} res
   */
  async claimCoupon (req, res) {
    const { u_id } = req.session
    const { coupon_id } = req.body
    const filterConf = '-_id -__v'

    try {
      const user = await UserModel.findOne({ u_id }, filterConf).lean(true)
      if (!user) {
        res.json({ code: 20002, msg: '用户不存在' })
        return
      }

      const existingIds = user.coupon_ids ? user.coupon_ids.split(',').filter(Boolean) : []
      if (existingIds.includes(String(coupon_id))) {
        res.json({ code: 20002, msg: '已领取该优惠券' })
        return
      }

      const newCouponIds = [...existingIds, String(coupon_id)].join(',')
      await UserModel.updateOne({ u_id }, { $set: { coupon_ids: newCouponIds } })
      res.json({ data: true })
    } catch (err) {
      _common.WebLogger.error('领取优惠券失败', err)
      res.json({
        code: 20002,
        msg: '领取优惠券失败',
        errLog: err
      })
    }
  }

  /**
   * 获取用户已领取的优惠券列表
   * @param {Object} req
   * @param {Object} res
   */
  async getUserCoupons (req, res) {
    const { u_id } = req.session
    const filterConf = '-_id -__v'

    try {
      const user = await UserModel.findOne({ u_id }, filterConf).lean(true)
      if (!user || !user.coupon_ids) {
        res.json({ data: [] })
        return
      }

      const ids = user.coupon_ids.split(',').filter(Boolean).map(Number)
      const coupons = await CouponModel.find({ coupon_id: { $in: ids } }, filterConf).lean(true)

      // 追加 valid 字段：判断优惠券是否已过期
      const now = new Date()
      const couponsWithValid = coupons.map(coupon => ({
        ...coupon,
        valid: now <= new Date(coupon.valid_end)
      }))

      res.json({ data: couponsWithValid })
    } catch (err) {
      _common.WebLogger.error('获取用户优惠券列表失败', err)
      res.json({
        code: 20002,
        msg: '获取用户优惠券列表失败',
        errLog: err
      })
    }
  }

  /**
   * 展示当前有效的优惠券（按 valid_start 倒序取第一个）
   * @param {Object} req
   * @param {Object} res
   */
  async showValidCoupon (req, res) {
    const filterConf = '-_id -__v'
    const now = new Date()

    try {
      const coupons = await CouponModel.find({
        valid_end: { $gte: now }
      }, filterConf)
        .sort({ valid_start: -1 })
        .limit(1)
        .lean(true)

      res.json({ data: coupons[0] || null })
    } catch (err) {
      _common.WebLogger.error('获取有效优惠券失败', err)
      res.json({
        code: 20002,
        msg: '获取有效优惠券失败',
        errLog: err
      })
    }
  }
}

module.exports = new CouponService()
