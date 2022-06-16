const express = require('express')
const router = express.Router()
const LoginControler = require('../../controler/admin/login')
const MenuControler = require('../../controler/admin/menu')

// 登录&登出
router.post('/noauth/login', LoginControler.login)
router.post('/noauth/logout', LoginControler.logout)
// 菜单管理
router.get('/auth/getMenuList', MenuControler.menuList)
router.get('/auth/getMenuDetail', MenuControler.menuDetail)
router.post('/auth/addMenu', MenuControler.addMenu)
router.post('/auth/updateMenu', MenuControler.updateMenu)
router.post('/auth/deleteMenu', MenuControler.deleteMenu)

module.exports = router