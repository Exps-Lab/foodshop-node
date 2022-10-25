const CityBase = require('../../../service/base-class/city-base')
const PosBase = require('../../../service/base-class/pos-base')
const CommonService = require('../../../service/h5/common')
const CommonHomeService = require('../../../service/h5/common/home')

class MainUserController {
  // 获取所有城市列表
  async getAllCity (req, res) {
    const cityBaseInstance = new CityBase()
    await cityBaseInstance.getAllCity(req, res)
  }

  // 根据ip获取定位
  async getPosByIp (req, res) {
    const posBaseInstance = new PosBase()
    const posInfo = await posBaseInstance.getPosByIp(req, res)
    res.json({
      data: posInfo
    })
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
    await CommonService.searchWithRangeService(req, res)
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
    await CommonService.searchWithoutKeywordService(req, res)
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
    await CommonHomeService.getPosCostTimeService(req, res)
  }
}

module.exports = new MainUserController()
