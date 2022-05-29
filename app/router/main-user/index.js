const express = require('express')
const router = express.Router()
const MainUserControler = require('../../controler/main-user/login')

router.get('/auth', MainUserControler.authDemo)
router.get('/addUser', MainUserControler.addUser)

module.exports = router