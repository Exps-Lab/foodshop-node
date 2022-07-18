
class BasePosClass {
  constructor() {
    this.bdKey = 'sgK6ypVfp11BPDC9p45i4h2F'
    this.txKey = 'UIWBZ-OJNWV-KOTPW-UEBS7-4KSVH-B2BNG'
  }

  async getRemoteAddress (req) {
    let ip = ''
    try {
      ip = await _common.request('https://ifconfig.me/ip')
    } catch(e) {
      ip =
        req.headers['X-Forwarded-For'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
    }
    return ip
  }

  // 根据ip获取城市名称
  async getCityNameFromIp (req) {
    let ip = await this.getRemoteAddress(req)
    const pos = await _common.request('https://api.map.baidu.com/location/ip', {
      ip,
      ak: this.bdKey
    })
    return pos.content.address.replace(/市$/, '')
  }

  // 检索某一行政区划内的地点信息
  async search (reqQuery) {
    const { keyword, city_name, pn } = reqQuery
    const pos = await _common.request('https://apis.map.qq.com/ws/place/v1/search', {
      keyword: encodeURIComponent(keyword),
      boundary: `region(${city_name}, 1)`,
      page_size: 10,
      page_index: pn,
      key: this.txKey
    })
    return pos
  }
}

module.exports = BasePosClass
