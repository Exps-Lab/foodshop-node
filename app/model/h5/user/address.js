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
  address_name: String,
  address_tag: String
});

// 注册插件
UserAddressSchema.plugin(AutoEnhanceIndexPlugin, { model: 'address', field: 'id' })
module.exports = mongoose.model('address', UserAddressSchema, 'address');
