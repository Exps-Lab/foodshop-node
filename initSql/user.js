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

module.exports = function initUser () {
  UserModel.find({ username: 'admin' }).then(res => {
    if (!res.length) {
      UserModel.create(administrator)
    }
  })
}

