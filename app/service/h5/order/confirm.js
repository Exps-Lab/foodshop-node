const ShopModel = require('../../../model/admin/shop')
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

  // 确认订单页详情
  // 包括购物袋选择的商品，商铺数据
  async getConfirmDetail (req, res) {
    try {
      const { shoppingBagId } = req.query
      const { RedisInstance } = _common
      const { choseGoods = null, shop_id } = JSON.parse(await RedisInstance.get(shoppingBagId) || '{}')
      const shopInfo = await ShopModel.findOne({ id: shop_id }, { admin_uid: 0, _id: 0, __v: 0 }).lean(true)

      // 购物袋15分钟redis缓存已失效
      if (choseGoods === null) {
        res.json({
          code: 20003,
          msg: '选择商品已失效，请重新下单',
          errLog: new Error('选择商品已失效，请重新下单')
        })
        return false
      }

      res.json({
        data: {
          choseGoods,
          shopInfo
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
}

module.exports = new OrderConfirmService()
