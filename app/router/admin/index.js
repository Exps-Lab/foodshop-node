const express = require('express')
const router = express.Router()
const LoginController = require('../../controller/admin/login')
const MenuController = require('../../controller/admin/menu')
const RoleController = require('../../controller/admin/role')
const CommonInfoController = require('../../controller/admin/common')

// common
router.get('/auth/commonInfo', CommonInfoController.getCommonInfo)

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

module.exports = router
