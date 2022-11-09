const PosService = require('../../../service/h5/sale/pos')
const CityService = require('../../../service/h5/sale/city')

class MainUserController {
  // 获取所有城市列表
  async getAllCity (req, res) {
    await CityService.getAllCityService(req, res)
  }

  // 根据ip获取定位
  async getPosByIp (req, res) {
    await PosService.getPosByIpService(req, res)
  }

  // 搜索附近place并且计算距传入点的距离
  async searchWithRangeControl (req, res) {
    try {
      _common.validate({
        keyword: 'string',
        city_name: 'string',
        current_pos: 'string',
        page_size: 'string',
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await PosService.searchWithRangeService(req, res)
  }

  // 搜索附近推荐的place
  async searchWithoutKeyword (req, res) {
    try {
      _common.validate({
        page_size: 'string',
        current_pos: 'string',
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await PosService.searchWithoutKeywordService(req, res)
  }

  // 获取两个位置到达时间
  async getPosCostTime (req, res) {
    try {
      _common.validate({
        startPos: 'string',
        endPosArr: 'array',
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return false
    }
    await PosService.getPosCostTimeService(req, res)
  }
}

module.exports = new MainUserController()
