const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 引入插件
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const UserSchema = new Schema({
  role: {
    type: Number,
    required: true
  },
  role_name: {
    type: String,
    required: true
  }
})

// 注册插件
UserSchema.plugin(AutoEnhanceIndexPlugin, { model: 'role', field: 'role_id' })
const roleModel = mongoose.model('role', UserSchema, 'role');

// 初始化默认角色
const defaultRoleConf = [{
  role: 1,
  role_name: "超级管理员"
},{
  role: 2,
  role_name: "用户"
}]
roleModel.find().then(res => {
  if (!res.length) {
    roleModel.create(defaultRoleConf)
  }
})

module.exports = roleModel
