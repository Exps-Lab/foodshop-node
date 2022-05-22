const express = require('express')
const router = express.Router()
const TestControler = require('../controler/test')

router.get('/a', TestControler.showTest)

router.get('/b', TestControler.sessionDemo)

router.get('/auth', TestControler.authDemo)

module.exports = router