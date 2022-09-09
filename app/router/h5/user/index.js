const express = require('express')
const router = express.Router()
const UserController = require('../../../controller/h5/user/login')

router.get('/auth/addUser', UserController.addUser)

module.exports = router
