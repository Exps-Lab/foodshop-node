const AdminUserModel  = require('../../model/admin/user')

class BaseClass {
  constructor() {
  }

  /**
   * 根据用户角色返回查询条件
   * @param nowField     当前数据库中的字段名
   * @param value        字段名对应的值
   * @returns {Promise<string|{}>}
   */
  async getQueryFromUser (nowField, value) {
    try {
      let resData = await AdminUserModel.findOne({ u_id: value }).lean(true)
      const { role } = resData
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
