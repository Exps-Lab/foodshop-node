const express = require('express')
const router = express.Router()
const CommonController = require('../../../controller/h5/common')

router.get('/noauth/getAllCity', CommonController.getAllCity)
router.get('/noauth/getPosByIp', CommonController.getPosByIp)
router.get('/noauth/place/searchWithRange', CommonController.searchWithRangeControl)

module.exports = router
