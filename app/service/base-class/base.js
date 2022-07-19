const UserModel  = require('../../model/main-user/login')
const AdminUserModel  = require('../../model/admin/user')

class BaseClass {
  constructor() {
  }

  /**
   * 根据用户角色返回查询条件
   * @param targetDBName 目标数据库
   * @param targetField  目标数据库中的字段名
   * @param nowField     当前数据库中的字段名
   * @param value        字段名对应的值
   * @returns {Promise<string|{}>}
   */
  async getQueryFromUser (targetDBName, targetField, nowField, value) {
    const modelMap = {
      'user': UserModel,
      'admin_user': AdminUserModel
    }
    const searchModal = modelMap[targetDBName]
    try {
      let resData = await searchModal.find({ [targetField]: value }).lean(true)
      const role = resData[0].role
      // 管理员
      if (role === 1) {
        return {}
      } else {
        return { [nowField]: value }
      }
    } catch (err) {
      _common.WebLogger.err('获取角色信息失败', err)
      return ''
    }
  }
}

module.exports = BaseClass
