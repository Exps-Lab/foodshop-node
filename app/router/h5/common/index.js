const express = require('express')
const router = express.Router()
const CommonController = require('../../../controller/h5/common')
const HomeController = require('../../../controller/h5/common/home')

router.get('/noauth/getAllCity', CommonController.getAllCity)
router.get('/noauth/getPosByIp', CommonController.getPosByIp)
router.get('/noauth/getPosCostTime', CommonController.getPosCostTime)
router.get('/noauth/place/searchWithRange', CommonController.searchWithRangeControl)
router.get('/noauth/place/searchWithoutKeyword', CommonController.searchWithoutKeyword)

/* 商家列表 */
router.get('/noauth/shop/list', HomeController.shopList)
router.get('/noauth/shop/getCategory', HomeController.getCategory)
router.get('/noauth/shop/getSubCategory', HomeController.getSubCategory)
router.get('/noauth/global/search', HomeController.shopAndFoodSearch)



module.exports = router
