const UserAccountService = require('../../../service/h5/user/account')

class UserAccountController {
  async getAccountMoney (req, res) {
    await UserAccountService.getAccountMoney(req, res)
  }

  async updateAccountMoney (req, res) {
    try {
      _common.validate({
        money: {
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
    await UserAccountService.updateAccountMoney(req, res)
  }
}

module.exports = new UserAccountController()
