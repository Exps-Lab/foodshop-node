const AccountModel  = require('../../../model/h5/user/account')

class AccountService {
  // 初始化创建账户
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

  /**
   * 统一处理获取账户余额
   * @param u_id
   * @returns {Promise}
   */
  async getAccountMoneyHelper (u_id) {
    if (!u_id) {
      throw new Error('获取账户必须传入u_id')
    }
    try {
      return await AccountModel.findOne({ u_id }).lean(true)
    } catch (err) {
      throw new Error(err)
    }
  }
  /**
   * 统一更新获取账户余额
   * @param u_id
   * @param changeMoney
   * @param type 'add', 'minus'
   * @returns {Promise}
   */
  async updateAccountMoneyHelper (u_id, changeMoney = 0, type = 'add') {
    if (!u_id) {
      throw new Error('更新账户必须传入u_id')
    }
    try {
      const { money: nowMoney } = await this.getAccountMoneyHelper(u_id)
      const calcMoney = type === 'add' ? nowMoney + changeMoney : nowMoney - changeMoney
      return await AccountModel.findOneAndUpdate({ u_id }, {
        money: calcMoney,
        money_modify_time: Date.now(),
      }, {
        new: true
      }).lean(true)

    } catch (err) {
      throw new Error(err)
    }
  }
  async getAccountMoney (req, res) {
    const { u_id } = req.session
    try {
      const data = await this.getAccountMoneyHelper(u_id)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '获取用户账户失败',
        errLog: err
      })
    }
  }
  async updateAccountMoney (req, res) {
    const { u_id } = req.session
    const { money = 100 } = req.body
    try {
      const data = await this.updateAccountMoneyHelper(u_id, money, 'add')
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
