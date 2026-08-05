const CouponService = require('../../../service/h5/user/coupon')

class CouponController {
  /**
   * 用户领取优惠券
   */
  async claimCoupon (req, res) {
    try {
      _common.validate({
        coupon_id: {
          type: 'number',
          convertType: 'number',
          required: true
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    await CouponService.claimCoupon(req, res)
  }

  /**
   * 获取用户已领取的优惠券列表
   */
  async getUserCoupons (req, res) {
    await CouponService.getUserCoupons(req, res)
  }

  /**
   * 展示当前有效的优惠券
   */
  async showValidCoupon (req, res) {
    await CouponService.showValidCoupon(req, res)
  }
}

module.exports = new CouponController()
