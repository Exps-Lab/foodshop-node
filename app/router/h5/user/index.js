const express = require('express')
const router = express.Router()
const UserController = require('../../../controller/h5/user/login')
const UserInfoController = require('../../../controller/h5/user/info')
const UserAddressController = require('../../../controller/h5/user/address')
const UserAccountController = require('../../../controller/h5/user/account')

// userLogin
router.get('/noauth/getCapture', UserController.getCapture)
router.get('/noauth/uploadToken', UserController.uploadToken)
router.post('/noauth/login', UserController.login)
router.post('/auth/logout', UserController.logout)

// userInfo
router.get('/auth/getUserInfo', UserInfoController.getUserInfo)
router.post('/auth/updateUserName', UserInfoController.updateUserName)
router.post('/auth/updateUserAvatar', UserInfoController.updateUserAvatar)

// userAddress
router.get('/auth/address/list', UserAddressController.getAddressList)
router.get('/auth/address/detail', UserAddressController.getAddressDetail)
router.post('/auth/address/add', UserAddressController.addAddress)
router.post('/auth/address/update', UserAddressController.updateAddress)
router.post('/auth/address/delete', UserAddressController.deleteAddress)

// userInfo
router.get('/auth/account/money/get', UserAccountController.getAccountMoney)
router.post('/auth/account/money/update', UserAccountController.updateAccountMoney)

module.exports = router
