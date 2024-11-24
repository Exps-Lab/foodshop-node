const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 引入插件
const AutoEnhanceIndexPlugin = require('../../../plugin/autoEnhanceIndex')

const AccountSchema = new Schema({
  u_id: {
    type: Number,
    required: true,
    index: true
  },
  money: {
    type: Number,
    required: true
  },
  money_modify_time: {
    type: Number,
    required: true
  }
});

// 注册插件
AccountSchema.plugin(AutoEnhanceIndexPlugin, { model: 'account', field: 'id' })
module.exports = mongoose.model('account', AccountSchema, 'account');
