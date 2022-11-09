const PosBase = require("../../base-class/pos-base")

class commonService extends PosBase {
  constructor() {
    super()
  }

  // 计算两个位置之间路线所需时间
  async getPosCostTimeService (req, res) {
    const [ startLat, startLng ] = req.query.startPos.split(',')
    const endPosGroups = req.query.endPosArr || []
    const timeGroups = []
    for (let i=0; i<endPosGroups.length; i++) {
      const { lat, lng } = JSON.parse(endPosGroups[i])
      const time = await this.getEBicyclingCostTime(`${startLat},${startLng}`, `${lat},${lng}`)
      timeGroups.push(time)
    }
    res.json({
      data: timeGroups
    })
  }

  // 查询附近地标并计算距离
  async searchWithRangeService (req, res) {
    const [ lat, lng ] = req.query.current_pos.split(',')
    const place = await this.search(req.query)

    let filter = place.data.map(item => {
      const { title = '', address = '', location } = item
      const distance = PosBase.getTwoPosDistance(Number(lat), Number(lng), location.lat, location.lng)
      return {
        title,
        address,
        location,
        distance
      }
    })
    res.json({
      data: {
        total: place.count,
        place: filter
      }
    })
  }

  // 获取附近推荐地标
  async searchWithoutKeywordService (req, res) {
    const place = await this.searchNearbyWithoutKeyword(req.query)
    const filter = place.data.map(item => {
      const { title = '', address = '', location } = item
      return {
        title,
        address,
        location
      }
    })
    res.json({
      data: {
        total: place.count,
        place: filter
      }
    })
  }

  // 根据ip获取定位
  async getPosByIpService (req, res) {
    let posData = await this.getPosByIp()
    res.json({
      data: posData
    })
  }
}

module.exports = new commonService()
