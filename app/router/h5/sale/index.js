const express = require('express')
const router = express.Router()
const CommonController = require('../../../controller/h5/sale/common')
const HomeController = require('../../../controller/h5/sale/home')
const ShopController = require('../../../controller/h5/sale/shop')

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

// 商铺信息
router.get('/noauth/shop/detail', ShopController.shopBaseInfo)
router.get('/noauth/shop/getGoods', ShopController.getShopGoods)
router.get('/noauth/shop/searchGoods', ShopController.searchShopGoods)

// 创建购物袋
router.post('/auth/shop/shoppingBag/add', ShopController.addShoppingBag)
module.exports = router
