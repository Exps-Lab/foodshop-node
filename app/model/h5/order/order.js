const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 引入插件
const AutoEnhanceIndexPlugin = require('../../../plugin/autoEnhanceIndex')

/**
 u_id: int; 用户id
 order_number: string；唯一订单号(19位)
 address_id: int; 收获地址id
 pay_origin: string; 支付方式
 comment_id: int; 评论id，订单评论后赋值
 create_time:   string; 订单创建时间（时间戳）
 pay_time:      string; 订单支付时间（时间戳）
 cancel_time:   string; 订单取消时间（时间戳）
 complete_time: string; 订单已送达时间，订单完成时间（时间戳）
 send_time:     string; 订单配送需要时间，需要计算（时间戳）
 order_status: int; 订单状态 待支付0，已支付（准备货物中，可以考虑去掉）1，已取消2，配送中3，已送达4
 shop_id: int; 商铺id
 delivery_fee: int; 商铺配送费
 goods_list: array; 订单商品信息列表
 package_fee: int; 订单打包费
 coupon_ids: string; 订单选择优惠券列表
 origin_price: int; 订单原价 skus价格 + 打包费 + 配送费
 shop_discount_price: int; 店铺满减
 discount_total_price: int; 总优惠金额 优惠券列表 + 店铺满减
 pay_price: int; 订单实际支付价格 订单原价 - 优惠券列表
 order_remarks: string; 订单备注
 order_ware: int; 是否需要餐具
 send_cost_time: int; 配送耗费时间
 */

const OrderSchema = new Schema({
  u_id: {
    type: Number,
    required: true,
    index: true
  },
  order_num: {
    type: String,
    required: true,
    index: true
  },
  address_id: {
    type: Number,
    required: true,
  },
  pay_origin: {
    type: String,
    default: '餐币',
  },
  comment_id: {
    type: Number,
    default: null,
  },
  create_time: {
    type: String,
    required: true,
    default: ''
  },
  pay_time: {
    type: String,
    default: ''
  },
  cancel_time: {
    type: String,
    default: ''
  },
  complete_time: {
    type: String,
    default: ''
  },
  send_time: {
    type: String,
    default: ''
  },
  order_status: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4],
    default: 0
  },
  shop_id: {
    type: Number,
    required: true,
  },
  delivery_fee: {
    type: Number,
    required: true,
  },
  goods_list: {
    type: Array,
    required: true,
  },
  package_fee: {
    type: Number,
    required: true,
  },
  coupon_ids: {
    type: String,
    default: ''
  },
  origin_price: {
    type: Number,
    required: true,
  },
  shop_discount_price: {
    type: Number,
  },
  discount_total_price: {
    type: Number,
  },
  pay_price: {
    type: Number,
    required: true,
  },
  order_remarks: {
    type: String,
    trim: true,
  },
  order_ware: {
    type: Boolean,
    required: true,
  },
  send_cost_time: {
    type: Number,
    require: true
  }
});

// 注册插件
OrderSchema.plugin(AutoEnhanceIndexPlugin, { model: 'order', field: 'id' })
module.exports = mongoose.model('order', OrderSchema, 'order');
