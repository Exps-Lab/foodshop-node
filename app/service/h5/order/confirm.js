const PosBase = require("../../base-class/pos-base")
const UserAddressService = require("../user/address")

class OrderConfirmService extends PosBase {
  constructor() {
    super()
  }

  // 获取距离定位最近的地址
  async getRecentAddress (req, res) {
    const { u_id } = req.session
    const [ shopLat, shopLng ] = req.query.userNowPos.split(',')
    const userAddressList = await UserAddressService.preGetAddressList(u_id)

    let recentPosIndex = -1
    let tempDistance = 0
    for (let i=0; i<userAddressList.length; i++) {
      const [ addressLat, addressLng ] = userAddressList[i].pos.split(',')
      const calcDistance = await PosBase.getTwoPosDistance(shopLat, shopLng, addressLat, addressLng)
      if (i === 0) {
        tempDistance = calcDistance
        recentPosIndex = 0
      } else {
        if (calcDistance < tempDistance) {
          tempDistance = calcDistance
          recentPosIndex = i
        }
      }
    }
    res.json({
      data: recentPosIndex !== -1 ? userAddressList[recentPosIndex] : null
    })
  }
}

module.exports = new OrderConfirmService()
