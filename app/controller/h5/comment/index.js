
const CommentService = require('../../../service/h5/order/comment')

class CommentController {
  // 提交评论
  async submitComment (req, res) {
    try {
      _common.validate({
        shopId: {
          type: 'number',
          convertType: 'number'
        },
        orderNum: {
          type: 'string',
        },
        ranks: {
          type: 'array',
          itemType: 'object',
          rule: {
            name: 'string',
            ranks: 'number'
          }
        },
        commentMsg: {
          type: 'string'
        },
        commentImg: {
          type: 'array',
          itemType: 'string',
        },
        commentSkus: {
          type: 'object'
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await CommentService.submitComment(req, res)
  }
}

module.exports = new CommentController()
