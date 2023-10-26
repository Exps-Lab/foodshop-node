const express = require('express')
const router = express.Router()
const OrderPayController = require('../../../controller/h5/pay/index')

router.post('/auth/order/pay', OrderPayController.orderPay)

module.exports = router
