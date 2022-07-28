const mongoose = require('mongoose')
const { Schema } = mongoose
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const FoodCategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  foods: {
    type: [Number],
    default: []
  }
})

FoodCategorySchema.plugin(AutoEnhanceIndexPlugin, { model: 'foodCategory', field: 'id' })   // 注册自增插件
module.exports = mongoose.model('foodCategory', FoodCategorySchema, 'foodCategory')
