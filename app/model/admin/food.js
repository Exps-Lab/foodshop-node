const mongoose = require('mongoose')
const { Schema } = mongoose
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const SpecFoodSchema = new Schema({
  name: String,
  packing_fee: Number,
  price: Number,
  stock: Number
})
const FoodSchema = new Schema({
  admin_uid: {
    type: Number,
    index: true
  },
  shop_id: Number,
  food_category_id: Number,
  name: String,
  description: String,
  material: String,
  measure: String,
  image_path: String,
  is_discount: Boolean,
  discount_val: Number,
  attrs: [String],
  specfoods: [SpecFoodSchema]
})

FoodSchema.plugin(AutoEnhanceIndexPlugin, { model: 'food', field: 'id' })   // 注册自增插件
module.exports = mongoose.model('food', FoodSchema, 'food')
