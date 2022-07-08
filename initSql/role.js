const RoleModel = require('../app/model/admin/role')

// 初始化默认角色
const defaultRoleConf = [{
  role: 1,
  role_name: "超级管理员"
},{
  role: 2,
  role_name: "用户"
}]

module.exports = function initRole () {
  RoleModel.find({ role: 1 }).then(res => {
    if (!res.length) {
      RoleModel.create(defaultRoleConf)
    }
  })
}

