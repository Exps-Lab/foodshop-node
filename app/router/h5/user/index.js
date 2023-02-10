const express = require('express')
const router = express.Router()
const UserController = require('../../../controller/h5/user/login')
const UserInfoController = require('../../../controller/h5/user/info')

// userLogin
router.get('/noauth/getCapture', UserController.getCapture)
router.get('/noauth/uploadToken', UserController.uploadToken)
router.post('/noauth/login', UserController.login)
router.post('/auth/logout', UserController.logout)

// userInfo
router.get('/auth/getUserInfo', UserInfoController.getUserInfo)
router.post('/auth/updateUserName', UserInfoController.updateUserName)
router.post('/auth/updateUserAvatar', UserInfoController.updateUserAvatar)

module.exports = router
