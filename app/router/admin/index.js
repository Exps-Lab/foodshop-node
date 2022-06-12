const express = require('express')
const router = express.Router()
const AdminControler = require('../../controler/admin/login')

router.post('/noauth/login', AdminControler.login)
router.post('/noauth/logout', AdminControler.logout)

module.exports = router