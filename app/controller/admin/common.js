const CommonService = require('../../service/admin/user')
const BaseClass = require('../../service/base-class/base')

class CommonController extends BaseClass {
  constructor () {
    super()
    this.uploadToken = this.uploadToken.bind(this)
  }
  async getCommonInfo (req, res) {
    await CommonService.getCommonInfo(req, res)
  }
  uploadToken (req, res) {
    this.getUploadToken(req, res)
  }
}

module.exports = new CommonController()
