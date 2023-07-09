
const CommentService = require('../../../service/h5/comment')

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

  async getCommentByShopId (req, res) {
    try {
      _common.validate({
        shopId: {
          type: 'number',
          convertType: 'number'
        },
        pageNum: {
          type: 'number',
          convertType: 'number'
        },
        pageSize: {
          type: 'number?',
          convertType: 'number'
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
    await CommentService.getCommentByShopId(req, res)
  }

  async getCommentListByOrder (req, res) {
    try {
      _common.validate({
        type: {
          type: 'number',
          convertType: 'number'
        },
        pageNum: {
          type: 'number',
          convertType: 'number'
        },
        pageSize: {
          type: 'number?',
          convertType: 'number'
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
    await CommentService.getCommentListByOrder(req, res)
  }
}

module.exports = new CommentController()
