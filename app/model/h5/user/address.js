const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 引入插件
const AutoEnhanceIndexPlugin = require('../../../plugin/autoEnhanceIndex')

const UserAddressSchema = new Schema({
  u_id: {
    type: Number,
    required: true,
    index: true
  },
  address: String,
  title: String,
  pos: String,
  room: String,
  receive: String,
  gender: {
    type: Number,
    required: false
  },  // 0先生 1女士
  phone: String,
  tag: {
    type: String,
    required: false
  }
});

// 注册插件
UserAddressSchema.plugin(AutoEnhanceIndexPlugin, { model: 'address', field: 'id' })
module.exports = mongoose.model('address', UserAddressSchema, 'address');
