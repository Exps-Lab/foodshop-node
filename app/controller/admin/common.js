const CommonService = require('../../service/admin/common')

class CommonController {
  getCommonInfo (req, res) {
    CommonService.getCommonInfo(req, res)
  }
  uploadToken (req, res) {
    CommonService.uploadToken(req, res)
  }
}

module.exports = new CommonController()
