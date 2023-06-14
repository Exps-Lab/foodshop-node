const express = require('express')
const router = express.Router()
const OrderConfirmController = require('../../../controller/h5/order/confirm')

router.get('/auth/getRecentAddress', OrderConfirmController.getRecentAddress)
router.get('/auth/getConfirmDetail', OrderConfirmController.getConfirmDetail)

router.post('/auth/order/create', OrderConfirmController.createOrder)

module.exports = router
