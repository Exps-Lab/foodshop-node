const UserInfoService = require('../../../service/h5/user/info')

class UserInfoController {
  getUserInfo (req, res) {
    UserInfoService.getUserInfo(req, res)
  }
  updateUserName (req, res) {
    UserInfoService.updateUserName(req, res)
  }
  updateUserAvatar (req, res) {
    UserInfoService.updateUserAvatar(req, res)
  }
}

module.exports = new UserInfoController()
