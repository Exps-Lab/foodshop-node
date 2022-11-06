const UserModel  = require('../../model/admin/user')
const MenuModel  = require('../../model/admin/menu')

class CommonInfoService {
  /* 获取菜单&用户信息 */
  async getCommonInfo(req, res) {
    const username = req.session.username
    const filterConf = '-_id -__v'

    try {
      const loginUserInfo = await UserModel.find({ username }, filterConf).lean(true)

      const authMenuFilter = loginUserInfo[0].role === 1 ? {} : { role: loginUserInfo[0].role }
      const authMenu = await MenuModel.find(authMenuFilter, filterConf).lean(true)
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

  /**
   * 根据用户角色返回查询条件
   * @param nowField     当前数据库中的字段名
   * @param value        字段名对应的值
   * @returns {Promise<string|{}>}
   */
  async getQueryFromUser (nowField, value) {
    try {
      let resData = await UserModel.findOne({ u_id: value }).lean(true)
      const { role } = resData
      // 管理员
      if (role === 1) {
        return {}
      } else {
        return { [nowField]: value }
      }
    } catch (err) {
      _common.WebLogger.error('获取角色信息失败', err)
      return ''
    }
  }
}

module.exports = new CommonInfoService()
