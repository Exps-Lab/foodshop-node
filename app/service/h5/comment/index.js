
const OrderInfoService = require("../order/info")
const CommentModal = require("../../../model/h5/order/comment")

class OrderCommentService {
  // 根据搜索条件获取对应的结果条数
  async getCommentCount (searchObj) {
    if (searchObj.constructor !== Object) return 0
    return await CommentModal.find(searchObj).count()
  }

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
        comment_msg: commentMsg,
        comment_img: commentImg,
        comment_skus: commentSkus,
        comment_time: new Date().formatTime('yyyy-MM-dd hh:mm:ss')
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
      const resData = await CommentModal.aggregate([
        {
          $lookup: {
            from: 'user',
            localField: 'u_id',
            foreignField: 'u_id',
            as: 'user',
          }
        }, {
          $unwind: '$user'
        },
        {
          $lookup: {
            from: 'order',
            localField: 'order_num',
            foreignField: 'order_num',
            as: 'order',
          }
        }, {
          $unwind: '$order'
        }, {
          $match: searchObj
        }, {
          $skip: (pageNum - 1) * pageSize
        }, {
          $limit: pageSize
        }, {
          $addFields: {
            user_avatar: '$user.avatar',
            user_name: '$user.username',
            goods_list: '$order.goods_list'
          }
        }, {
          $project: {
            _id: 0,
            __v: 0,
            u_id: 0,
            user: 0,
            order: 0
          }
        }
      ])
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
