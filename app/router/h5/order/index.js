const express = require('express')
const router = express.Router()
const OrderConfirmController = require('../../../controller/h5/order/confirm')
const OrderInfoController = require('../../../controller/h5/order/info')
const CommentController = require('../../../controller/h5/comment')

router.get('/auth/getRecentAddress', OrderConfirmController.getRecentAddress)
router.get('/auth/getConfirmDetail', OrderConfirmController.getConfirmDetail)

router.post('/auth/order/create', OrderConfirmController.createOrder)
router.get('/auth/order/detail', OrderInfoController.getOrderDetail)
router.post('/auth/order/cancel', OrderInfoController.cancelOrder)

// 评论模块
router.post('/auth/comment/submit', CommentController.submitComment)
router.get('/auth/comment/getByShopId', CommentController.getCommentByShopId)

module.exports = router
