const AiService = require('../../service/admin/ai')

class AiController {
  async genShopDesc (req, res) {
    try {
      _common.validate({
        keyword: 'string'
      }, req)

      const keyword = String(req.query.keyword || '').trim().replace(/\s+/g, ' ')
      if (!keyword) {
        res.json({
          code: 10001,
          msg: '店铺关键词不能为空',
          errLog: 'keyword is empty'
        })
        return
      }
      if (keyword.length > 50) {
        res.json({
          code: 10001,
          msg: '店铺关键词长度不能超过50个字符',
          errLog: `keyword length overflow: ${keyword.length}`
        })
        return
      }
      req.query.keyword = keyword
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }

    // 默认非流式模式，通过 stream 参数区分
    const stream = !!req.query.stream
    if (stream) {
      await AiService.genShopDescStream(req, res)
    } else {
      await AiService.genShopDesc(req, res)
    }
  }
}

module.exports = new AiController()
