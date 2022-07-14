const CommonService = require('../../service/admin/common')

class CommonController {
  async getCommonInfo (req, res) {
    await CommonService.getCommonInfo(req, res)
  }
  uploadToken (req, res) {
    CommonService.uploadToken(req, res)
  }
}

module.exports = new CommonController()
