const RoleModel = require('../app/model/admin/role')

// 初始化默认角色
const defaultRoleConf = [{
  role: 1,
  role_name: "超级管理员"
},{
  role: 2,
  role_name: "用户"
}]

module.exports = async function initRole () {
  return RoleModel.find({ role: 1 })
    .then(async res => {
      if (!res.length) {
        await RoleModel.create(defaultRoleConf)
      }
    })
    .catch(err => {
      console.error(chalk.red('初始化默认角色失败: ' + err))
    })
}
