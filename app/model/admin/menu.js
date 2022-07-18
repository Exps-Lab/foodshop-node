const mongoose = require('mongoose')
const { Schema } = mongoose
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const MenuSchema = new Schema({
  path: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: true,
    ref: 'role'
  },
  icon: String,
  is_hidden: Boolean,
  is_default: {
    type: Boolean,
    default: false
  },
  children: Array
})

MenuSchema.plugin(AutoEnhanceIndexPlugin, { model: 'menu', field: 'id' })   // 注册自增插件
module.exports = mongoose.model('menu', MenuSchema, 'menu')
