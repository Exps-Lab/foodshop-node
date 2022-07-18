const mongoose = require('mongoose')
const { Schema } = mongoose
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const baseSchema = {
  id: Number,
  level: Number,
  name: String
}

const CategorySchema = new Schema({
  ...baseSchema,
  ids: {
    type: Array,
    default: []
  },
  sub_categories: [ baseSchema ]
})

CategorySchema.plugin(AutoEnhanceIndexPlugin, { model: 'category', field: 'category_id' })   // 注册自增插件
module.exports = mongoose.model('category', CategorySchema, 'category')
