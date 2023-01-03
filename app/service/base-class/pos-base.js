const BaseClass = require('./base')

class BasePosClass extends BaseClass {
  constructor() {
    super()
    this.bdKey = 'sgK6ypVfp11BPDC9p45i4h2F'
    this.txKey = 'UIWBZ-OJNWV-KOTPW-UEBS7-4KSVH-B2BNG'
  }

  /**
   * 两个定位(gps)的直线距离
   * @param lat1 起点纬度
   * @param lng1 起点经度
   * @param lat2 终点纬度
   * @param lng2 终点经度
   * @returns {number}
   */
  static getTwoPosDistance (lat1,  lng1,  lat2,  lng2){
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137 ; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return Number(s.toFixed(2))
  }

  // 两位置路线耗费时间
  // startPos String (lat 纬度, lng 经度)
  // endPos   String (lat 纬度, lng 经度)
  async getEBicyclingCostTime (startPos, endPos) {
    const txEBicyclingApi = 'https://api.map.baidu.com/direction/v2/riding'
    try {
      const resObj = await _common.request(txEBicyclingApi, {
        origin: startPos,
        destination: endPos,
        ak: this.bdKey,
        riding_type: 1, // 0：自行车，1电车，
      })
      const { duration } = resObj.result.routes[0]
      return Math.floor(duration / 60)
    } catch (e) {
      return null
    }
  }

  // 获取真实ip
  async getRemoteAddress (req) {
    let ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress

    // [note] 本地运行获取本机真实ip
    if (ip === '127.0.0.1') {
      ip = await _common.request('https://ifconfig.me/ip')
    }
    return ip
  }

  // 根据ip获取模糊定位
  async getPosByIp (req) {
    let ip = await this.getRemoteAddress(req)
    try {
      return await _common.request('https://apis.map.qq.com/ws/location/v1/ip', {
        ip,
        key: this.txKey
      })
    } catch (e) {
      return {
        result: null
      }
    }
  }

  // 根据ip获取城市名称
  async getCityNameFromIp (req) {
    const pos = await this.getPosByIp(req)
    const city = pos.result?.ad_info.city || '未知'
    return city.replace(/市$/, '')
  }

  // 检索某一行政区划内的地点信息
  async search (reqQuery) {
    const { keyword = '', city_name, page_num = 1, page_size = 10 } = reqQuery
    return await _common.request('https://apis.map.qq.com/ws/place/v1/search', {
      keyword: encodeURIComponent(keyword),
      boundary: `region(${city_name}, 1)`,
      page_size,
      page_index: page_num,
      key: this.txKey
    })
  }

  // 检索附近推荐地址
  async searchNearbyWithoutKeyword (reqQuery) {
    const { current_pos, page_num = 1, page_size = 10 } = reqQuery
    return await _common.request('https://apis.map.qq.com/ws/place/v1/explore', {
      boundary: `nearby(${current_pos},100)`,
      page_size,
      page_index: page_num,
      key: this.txKey
    })
  }
}

module.exports = BasePosClass
