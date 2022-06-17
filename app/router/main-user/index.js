const express = require('express')
const router = express.Router()
const MainUserController = require('../../controller/main-user/login')

router.get('/auth', MainUserController.authDemo)
router.get('/addUser', MainUserController.addUser)

module.exports = router
