const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 引入插件
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true,
  },
  role: Number,
  role_name: String,
  avatar: String,
  c_time: Number,
})

// 注册插件
UserSchema.plugin(AutoEnhanceIndexPlugin, { model: 'admin_user', field: 'u_id' })
const userModel = mongoose.model('admin_user', UserSchema, 'admin_user');

// 初始化超级管理员
const administrator = {
  "username" : "admin",
  "password" : Buffer.from('admin').toString('base64'),
  "role" : 1,
  "role_name" : "超级管理员",
  "c_time" : Date.now(),
  "avatar": ''
}
userModel.find({ username: 'admin' }).then(res => {
  if (!res.length) {
    userModel.create(administrator)
  }
})

module.exports = userModel
