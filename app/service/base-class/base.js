
class BasePosClass {
  constructor() {
    this.bdKey = 'sgK6ypVfp11BPDC9p45i4h2F'
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
  async getPosFromIp (req) {
    await this.getRemoteAddress(req)
  }
}

module.exports = BasePosClass
