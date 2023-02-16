const UserAddressModel  = require('../../../model/h5/user/address')

class UserAddressService {
  constructor() {
    /** 地址数据字段
     * address 地址位置
     * room    门牌号
     * receive 收货人
     * gender  收货人性别
     * phone   手机号
     * tag     标签 (“家”，“公司”，“学校”)
     */
    this.addressData = [
      'u_id',
      'address',
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
    const { u_id } = req.session
    return this.addressData.reduce((map, key) => {
      return map[key] = (key === 'u_id') ? u_id : req.body[key]
    }, {})
  }

  // 地址列表
  async getUserAddressListService (req, res) {
    const { u_id } = req.session
    try {
      const data = await UserAddressModel.find({ u_id }).lean(true) || []
      res.json({
        data
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
    const { id } = req.body
    try {
      const data = await UserAddressModel.deleteOne({ u_id, id })
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
    const { id } = req.body
    const reqData = this.createRequestData(req)
    try {
      const data = await UserAddressModel.findOneAndUpdate(
        { u_id, id },
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
}

module.exports = new UserAddressService()
