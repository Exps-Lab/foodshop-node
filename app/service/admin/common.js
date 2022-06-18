const UserModel  = require('../../model/admin/user')
const MenuModel  = require('../../model/admin/menu')

class RoleService {
  async getCommonInfo(req, res) {
    const username = req.session.username
    const filterConf = '-_id -__v'
    const staticMenu = {

    }

    try {
      const loginUserInfo = await UserModel.find({ username }, filterConf)
      const authMenu = await MenuModel.find({ role: loginUserInfo.role }, filterConf)
      res.json({
        data: {
          menuList: authMenu,
          userInfo: loginUserInfo
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
}

module.exports = new RoleService()
