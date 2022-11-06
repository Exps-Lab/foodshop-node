const PosBase = require("../../base-class/pos-base")

class commonService extends PosBase {
  constructor() {
    super()
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
}

module.exports = new commonService()
