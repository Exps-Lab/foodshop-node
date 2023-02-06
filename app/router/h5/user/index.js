const express = require('express')
const router = express.Router()
const UserController = require('../../../controller/h5/user/login')

router.get('/noauth/getCapture', UserController.getCapture)
router.post('/noauth/login', UserController.login)
router.post('/auth/logout', UserController.logout)
router.post('/auth/getUserInfo', UserController.getUserInfo)

module.exports = router
