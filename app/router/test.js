const express = require('express')
const router = express.Router()
const TestControler = require('../controler/test')

router.get('/a', TestControler.showTest)

router.get('/b', function (req, res) {
  res.send('About testRouter b page')
})

module.exports = router