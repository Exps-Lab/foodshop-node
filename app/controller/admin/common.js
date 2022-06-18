const CommonService = require('../../service/admin/common')

class CommonController {
  getCommonInfo (req, res) {
    CommonService.getCommonInfo(req, res)
  }
}

module.exports = new CommonController()
