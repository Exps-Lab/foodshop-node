const express = require('express')
const router = express.Router()
const UserCouponController = require('../../../controller/h5/user/coupon')

// coupon
router.post('/auth/claim', UserCouponController.claimCoupon)
router.get('/auth/list', UserCouponController.getUserCoupons)
router.get('/noauth/showValid', UserCouponController.showValidCoupon)

module.exports = router
