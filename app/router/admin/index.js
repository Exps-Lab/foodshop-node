const express = require('express')
const router = express.Router()
const LoginController = require('../../controller/admin/login')
const MenuController = require('../../controller/admin/menu')
const RoleController = require('../../controller/admin/role')
const CommonInfoController = require('../../controller/admin/common')
const ShopController = require('../../controller/admin/shop')
const FoodCategoryController = require('../../controller/admin/food-category')

// common
router.get('/auth/getCommonInfo', CommonInfoController.getCommonInfo)
router.get('/noauth/uploadToken', CommonInfoController.uploadToken)

// 角色列表
router.get('/noauth/getRoleList', RoleController.getRoleList)

// 登录&登出
router.post('/noauth/login', LoginController.login)
router.post('/noauth/logout', LoginController.logout)

// 菜单管理
router.get('/auth/getMenuList', MenuController.menuList)
router.get('/auth/getMenuDetail', MenuController.menuDetail)
router.post('/auth/addMenu', MenuController.addMenu)
router.post('/auth/updateMenu', MenuController.updateMenu)
router.post('/auth/deleteMenu', MenuController.deleteMenu)

// 店铺管理
router.get('/noauth/place/getCityInfo', ShopController.getCityInfo)
router.get('/noauth/place/search', ShopController.searchPlace)
router.get('/noauth/shop/category', ShopController.getCategory)
router.get('/auth/shop/list', ShopController.shopList)
router.post('/auth/shop/delete', ShopController.deleteShop)
router.post('/auth/shop/add', ShopController.addShop)
router.post('/auth/shop/update', ShopController.updateShop)
router.get('/auth/shop/detail', ShopController.getDetail)

// 商品管理
router.get('/auth/food/getFoodCategoryList', FoodCategoryController.categoryList)
router.post('/auth/food/addFoodCategory', FoodCategoryController.addCategory)

module.exports = router
