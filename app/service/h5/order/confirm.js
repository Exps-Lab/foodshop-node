const PosBase = require("../../base-class/pos-base")
const UserAddressService = require("../user/address")
const ShopBase = require("../../base-class/shop-base")
const OrderModal = require("../../../model/h5/order/order")
const { shoppingBagPreKey } = require('../../../redis-prekey')

class OrderConfirmService extends PosBase {
  constructor() {
    super()
    this.ShopBaseInstance = new ShopBase()
  }

  // 获取shoppingBad信息
  async getShoppingBagInfo (shoppingBagId, res) {
    const { RedisInstance } = _common
    const { key } = shoppingBagPreKey
    const ShoppingBagKey = `${key}:${shoppingBagId}`
    const { choseGoods = null, shop_id } = JSON.parse(await RedisInstance.get(ShoppingBagKey) || '{}')

    // 购物袋15分钟redis缓存已失效
    if (choseGoods === null) {
      res.json({
        code: 20003,
        msg: '选择商品已失效，请重新下单',
        errLog: new Error('选择商品已失效，请重新下单')
      })
      return null
    }

    return {
      shop_id,
      choseGoods
    }
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
      const shoppingBagData = await this.getShoppingBagInfo(shoppingBagId, res)
      if (shoppingBagData !== null) {
        const { choseGoods, shop_id } = shoppingBagData
        const shopInfo = await this.ShopBaseInstance.getShopBaseInfo(shop_id)

        res.json({
          data: {
            choseGoods,
            shopInfo
          }
        })
      }
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }

  // 创建订单
  async createOrder (req, res) {
    const { u_id } = req.session
    const { shoppingBagId, addressId, orderRemarks, orderWare } = req.body

    try {
      const shoppingBagData = await this.getShoppingBagInfo(shoppingBagId, res)
      if (shoppingBagData !== null) {
        const { choseGoods, shop_id } = shoppingBagData
        const shopInfo = await this.ShopBaseInstance.getShopBaseInfo(shop_id)
        const orderNumber = _common.generateOrderNumber(shop_id, u_id)
        // 计算订单相关金额
        const {goodsPrice, payPrice} = _common.orderTotalNeedPay(choseGoods, shopInfo)
        // 拼装订单提交数据
        const standardOrderData = {
          u_id,
          shop_id,
          order_num: orderNumber,
          address_id: addressId,
          goods_list: choseGoods,
          order_remarks: orderRemarks,
          order_ware: orderWare,
          pay_price: payPrice,
          origin_price: goodsPrice,
          delivery_fee: shopInfo.delivery_fee,
          package_fee: _common.calcTotalBagFee(choseGoods),
          shop_discount_price: _common.getDiscountInfo(shopInfo, goodsPrice).price,
          // 目前没有优惠券，暂不计算
          discount_total_price: _common.getDiscountInfo(shopInfo, goodsPrice).price
        }

        OrderModal.create(standardOrderData)
        res.json({
          data: standardOrderData
        })
      }
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
