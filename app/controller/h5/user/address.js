const UserAddressService = require('../../../service/h5/user/address')

class UserAddressController {
  async addAddress (req, res) {
    try {
      _common.validate({
        address: 'string',
        title: 'string',
        pos: 'string',
        room: 'string',
        receive: 'string',
        gender: {
          type: 'number',
          convertType: 'number',
          required: false
        },
        phone: 'string',
        tag: 'string?'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await UserAddressService.addUserAddressService(req, res)
  }

  async updateAddress (req, res) {
    try {
      _common.validate({
        address_id: {
          type: 'number',
          convertType: 'number',
          required: true
        },
        address: 'string',
        title: 'string',
        pos: 'string',
        room: 'string',
        receive: 'string',
        gender: {
          type: 'number',
          convertType: 'number',
          required: false
        },
        phone: 'string',
        tag: 'string?'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await UserAddressService.updateUserAddressService(req, res)
  }

  async getAddressList (req, res) {
    await UserAddressService.getUserAddressListService(req, res)
  }

  async getAddressDetail (req, res) {
    try {
      _common.validate({
        address_id: {
          type: 'number',
          convertType: 'number',
          required: true
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await UserAddressService.getUserAddressDetailService(req, res)
  }

  async deleteAddress (req, res) {
    try {
      _common.validate({
        address_id: {
          type: 'number',
          convertType: 'number',
          required: true
        }
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err,
      })
      return
    }
    await UserAddressService.deleteUserAddressService(req, res)
  }
}

module.exports = new UserAddressController()
