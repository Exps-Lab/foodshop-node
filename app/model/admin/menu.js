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
  is_default: {
    type: Boolean,
    default: false
  },
  children: String
})

MenuSchema.plugin(AutoEnhanceIndexPlugin, { model: 'menu', field: 'id' })   // 注册自增插件
const menuModel = mongoose.model('menu', MenuSchema, 'menu')

// 初始化默认菜单
const defaultMenuConf = [{
  path: '/menu/index',
  label: '菜单管理',
  icon: 'list',
  role : 1,
  is_default: true
}, {
  path: '/menu/detail',
  label: '菜单详情',
  icon: 'apps',
  role : 1,
  is_default: true
}]
menuModel.find().then(res => {
  if (!res.length) {
    menuModel.create(defaultMenuConf)
  }
})

module.exports = menuModel
