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
module.exports = mongoose.model('role', UserSchema, 'role');
