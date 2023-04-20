const AccountModel  = require('../../../model/h5/user/account')

class AccountService {
  async initAccountMoney (u_id) {
    try {
      const params = {
        money: 100,
        money_modify_time: Date.now()
      }
      await AccountModel.create({
        u_id,
       ...params
      })
      return params
    } catch (err) {
      return null
    }
  }
  async updateAccountMoney (req, res) {
    const { u_id } = req.session
    const { money = 100 } = req.body
    try {
      const data = await AccountModel.findOneAndUpdate({ u_id }, {
        money,
        money_modify_time: Date.now()
      }).lean(true)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '更新账户失败',
        errLog: err
      })
    }
  }
}

module.exports = new AccountService()
