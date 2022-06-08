const express = require('express')
const router = express.Router()
const AdminControler = require('../../controler/admin/login')

router.post('/noauth/login', AdminControler.login)

module.exports = router