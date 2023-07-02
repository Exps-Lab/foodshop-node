
const OrderInfoService = require("../order/info")
const CommentModal = require("../../../model/h5/order/comment")

class OrderCommentService {
  // 提交评论
  async submitComment (req, res) {
    const { u_id } = req.session
    const { shopId, ranks, orderNum, commentMsg, commentImg, commentSkus  } = req.body

    try {
      const data = await CommentModal.create({
        u_id,
        ranks,
        shop_id: shopId,
        order_num: orderNum,
        comment_time: Date.now(),
        comment_msg: commentMsg,
        comment_img: commentImg,
        comment_skus: commentSkus
      })
      // [note] 更新订单表评论id
      await OrderInfoService.updateOrderDetailHelper(orderNum, {
        comment_id: data.id
      })
      res.json({
        data: '评论提交成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  async getCommentByShopId (req, res) {
    const { shopId, pageNum = 1, pageSize = 10 } = req.query

    const searchObj = {
      shop_id: shopId,
    }
    // 返回的分页参数
    const paginationMap = {
      pageNum,
      pageSize,
      total: 0,
      hasNext: null
    }

    try {
      const resData = await CommentModal.find(searchObj).skip((pageNum - 1) * pageSize).limit(pageSize).lean(true)
      paginationMap.total = await CommentModal.find(searchObj).count()
      paginationMap.hasNext = (paginationMap.total > pageNum * pageSize)

      res.json({
        data: {
          list: resData,
          ...paginationMap
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
}

module.exports = new OrderCommentService()
