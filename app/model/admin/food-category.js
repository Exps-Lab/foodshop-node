const mongoose = require('mongoose')
const { Schema } = mongoose
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const foodIdSchema = new Schema({
  id: Number
})
const FoodCategorySchema = new Schema({
  shop_id: Number,
  name: String,
  description: String,
  foods: {
    type: [foodIdSchema],
    default: []
  }
})

FoodCategorySchema.plugin(AutoEnhanceIndexPlugin, { model: 'food_category', field: 'id' })   // 注册自增插件
module.exports = mongoose.model('food_category', FoodCategorySchema, 'food_category')
