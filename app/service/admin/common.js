const UserModel  = require('../../model/admin/user')
const MenuModel  = require('../../model/admin/menu')

class CommonInfoService {
  async getCommonInfo(req, res) {
    const username = req.session.username
    const filterConf = '-_id -__v'

    try {
      const loginUserInfo = await UserModel.find({ username }, filterConf).lean(true)

      const authMenuFilter = loginUserInfo[0].role === 1 ? {} : { role: loginUserInfo[0].role }
      const authMenu = await MenuModel.find(authMenuFilter, filterConf).lean(true)
      authMenu.forEach(menu => {
        menu.children = menu.children ? JSON.parse(menu.children) : []
      })
      res.json({
        data: {
          menuList: authMenu,
          userInfo: loginUserInfo[0]
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

module.exports = new CommonInfoService()
