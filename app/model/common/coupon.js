const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoEnhanceIndexPlugin = require('../../plugin/autoEnhanceIndex')

const CouponSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  base_val: {
    type: Number,
    required: true
  },
  valid_start: {
    type: Date,
    required: true
  },
  valid_end: {
    type: Date,
    required: true
  },
  create_user: {
    type: String,
    default: '暂无',
    required: true
  },
  update_user: {
    type: String,
    default: '暂无',
    required: true
  },
  c_time: Number,
  update_time: Number
})

CouponSchema.index({ coupon_id: 1 })
CouponSchema.plugin(AutoEnhanceIndexPlugin, { model: 'coupon', field: 'coupon_id' })

module.exports = mongoose.model('coupon', CouponSchema, 'coupon')
