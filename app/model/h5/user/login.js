const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 引入插件
const AutoEnhanceIndexPlugin = require('../../../plugin/autoEnhanceIndex')

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
  avatar: String,
  c_time: Number,
});

// 注册插件
UserSchema.plugin(AutoEnhanceIndexPlugin, { model: 'user', field: 'u_id' })
module.exports = mongoose.model('user', UserSchema, 'user');
