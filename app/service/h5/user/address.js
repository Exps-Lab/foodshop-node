const UserAddressModel  = require('../../../model/h5/user/address')

class UserAddressService {
  constructor() {
    /** 地址数据字段
     * u_id    用户uid
     * address 地址位置
     * title   地址位置对应展示名称
     * pos     地址roi字符串（lat, lng）
     * room    门牌号
     * receive 收货人
     * gender  收货人性别 0先生 1女士
     * phone   手机号
     * tag     标签 (“家”，“公司”，“学校”)
     */
    this.addressData = [
      'u_id',
      'address',
      'title',
      'pos',
      'room',
      'receive',
      'gender',
      'phone',
      'tag'
    ]
  }

  // 统一构建新增/更新的请求数据
  createRequestData (req) {
    return this.addressData.reduce((map, key) => {
      map[key] = (key === 'u_id') ? req.session.u_id : req.body[key]
      return map
    }, {})
  }

  // 地址列表
  async getUserAddressListService (req, res) {
    const { u_id } = req.session
    try {
      const data = await UserAddressModel.find({ u_id }).lean(true) || []
      // 加密手机号
      const transData = data.map(address => {
        address.phone = _common.cryptoPhone(address.phone)
        return address
      })
      res.json({
        data: transData
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '获取地址列表失败',
        errLog: err
      })
    }
  }

  // 新增地址
  async addUserAddressService (req, res) {
    const reqData = this.createRequestData(req)
    try {
      const data = await UserAddressModel.create(reqData)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '新增地址失败',
        errLog: err
      })
    }
  }

  // 删除地址
  async deleteUserAddressService (req, res) {
    const { u_id } = req.session
    const { address_id } = req.body
    try {
      const data = await UserAddressModel.deleteOne({ u_id, id: address_id })
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '删除地址失败',
        errLog: err
      })
    }
  }

  // 更新地址
  async updateUserAddressService (req, res) {
    const { u_id } = req.session
    const { address_id } = req.body
    const reqData = this.createRequestData(req)
    try {
      const data = await UserAddressModel.findOneAndUpdate(
        { u_id, id: address_id },
        reqData,
        { new: true }
      ).lean(true)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '更新地址失败',
        errLog: err
      })
    }
  }

  // 获取地址详情
  async getUserAddressDetailService (req, res) {
    const { u_id } = req.session
    const { address_id } = req.query
    const reqData = this.createRequestData(req)
    try {
      const data = await UserAddressModel.findOne({ u_id, id: address_id }, '-__v -_id').lean(true)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '获取地址详情失败',
        errLog: err
      })
    }
  }
}

module.exports = new UserAddressService()
