const UserModel = require('../app/model/admin/user')

// 初始化超级管理员
const administrator = {
  "username" : "admin",
  "password" : Buffer.from('admin').toString('base64'),
  "role" : 1,
  "role_name" : "超级管理员",
  "c_time" : Date.now(),
  "avatar": ''
}

module.exports = async function initUser () {
  return UserModel.find({ username: 'admin' })
    .then(async res => {
      if (!res.length) {
        await UserModel.create(administrator)
      }
    })
    .catch(err => {
      console.error(chalk.red('初始化默认超级管理员失败: ' + err))
    })
}
