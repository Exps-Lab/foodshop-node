const express = require('express')
const router = express.Router()
const OrderConfirmController = require('../../../controller/h5/order/confirm')
const OrderInfoController = require('../../../controller/h5/order/info')

router.get('/auth/getRecentAddress', OrderConfirmController.getRecentAddress)
router.get('/auth/getConfirmDetail', OrderConfirmController.getConfirmDetail)

router.post('/auth/order/create', OrderConfirmController.createOrder)
router.get('/auth/order/detail', OrderInfoController.getOrderDetail)
router.post('/auth/order/cancel', OrderInfoController.cancelOrder)

module.exports = router
