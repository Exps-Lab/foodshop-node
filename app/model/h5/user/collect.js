const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 引入插件
const AutoEnhanceIndexPlugin = require('../../../plugin/autoEnhanceIndex')

const CollectSchema = new Schema({
  u_id: {
    type: Number,
    required: true,
    index: true
  },
  shop_id: {
    type: Number,
    required: true
  },
  collect_time: {
    type: String,
    required: true
  }
});

// 注册插件
CollectSchema.plugin(AutoEnhanceIndexPlugin, { model: 'collect', field: 'id' })
module.exports = mongoose.model('collect', CollectSchema, 'collect');
