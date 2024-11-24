const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 引入插件
const AutoEnhanceIndexPlugin = require('../../../plugin/autoEnhanceIndex')

/**
 * u_id 用户id
 * order_num 订单num
 * shop_id 商铺id
 * ranks 评论星数，内部为json
 * eg: {
 *   name: '包装',
 *   ranks: 4
 * }
 * comment_time  评论时间
 * comment_msg   评论文案
 * comment_img   评论上传图片数组，内部为七牛云地址string
 * comment_skus  评论skuIds，用"skuid-specId"标识， 1推荐，0不推荐
 * eg: {
 *   2-0: 0,
 *   8-1: 1
 * }
 */

const CommentSchema = new Schema({
  u_id: {
    type: Number,
    required: true,
  },
  order_num: {
    type: String,
    required: true,
    index: true
  },
  shop_id: {
    type: Number,
    required: true,
    index: true
  },
  ranks: {
    type: Array,
    required: true
  },
  comment_time: {
    type: String,
    required: true
  },
  comment_msg: {
    type: String,
    required: true
  },
  comment_img: {
    type: Array,
    default: []
  },
  comment_skus: {
    type: Array,
    default: []
  }
});

// 注册插件
CommentSchema.plugin(AutoEnhanceIndexPlugin, { model: 'comment', field: 'id' })
module.exports = mongoose.model('comment', CommentSchema, 'comment');
