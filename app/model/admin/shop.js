const mongoose = require('mongoose')
const { Schema } = mongoose
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const ShopSchema = new Schema({
  name: String,
  address: String,
  pos: {
    lat: Number,
    lng: Number
  },
  phone: String,
  intro_text: String,
  shop_mark: String,
  category: Array,
  delivery_fee: Number,
  mini_delivery_price: Number,
  open_time: Array,
  shop_image: {
    avatar: String,
    business_licence: String,
    food_licence: String
  }
})

ShopSchema.plugin(AutoEnhanceIndexPlugin, { model: 'shop', field: 'id' })   // 注册自增插件
module.exports = mongoose.model('shop', ShopSchema, 'shop')
