const CouponService = require('../../service/admin/coupon')

class CouponController {
  /**
   * 获取优惠券列表
   */
  async getCouponList (req, res) {
    try {
      _common.validate({
        page_num: {
          type: 'number?',
          convertType: 'number'
        },
        page_size: {
          type: 'number?',
          convertType: 'number'
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
    await CouponService.getCouponList(req, res)
  }

  /**
   * 获取优惠券详情
   */
  async getCouponDetail (req, res) {
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
    await CouponService.getCouponDetail(req, res)
  }

  /**
   * 新增优惠券
   */
  async addCoupon (req, res) {
    try {
      _common.validate({
        title: 'string',
        base_val: {
          type: 'number',
          convertType: 'number',
          required: true
        },
        valid_start: {
          type: 'number',
          convertType: 'number',
          required: true
        },
        valid_end: {
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
    await CouponService.addCoupon(req, res)
  }

  /**
   * 更新优惠券
   */
  async updateCoupon (req, res) {
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
    await CouponService.updateCoupon(req, res)
  }

  /**
   * 删除优惠券
   */
  async deleteCoupon (req, res) {
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
    await CouponService.deleteCoupon(req, res)
  }
}

module.exports = new CouponController()
