const UserModel  = require('../../../model/h5/user/login')
const CaptchaInstance = require("../../../helper/captcha")
const LoginBase = require("../../base-class/login-base")

class LoginService extends LoginBase {
  constructor() {
    super('h5')
  }

  async getCapture (req, res) {
    const { code, svg } = CaptchaInstance.init()
    req.session.captureCode = code
    res.json({
      data: svg,
      msg: 'succeed!'
    })
  }

  login (req, res) {
    this.baseLogin(req, res)
  }
  logout (req, res) {
    this.baseLogout(req, res)
  }

  /**
   * 获取用户信息
   * @param req
   * @param res
   * @returns {Promise<void>}
   * {
   *   username,
   *   u_id,
   *   c_time
   * }
   */
  async getUserInfo (req, res) {
    const { u_id, username } = req.session
    const filterConf = '-_id -__v'
    let returnData = {}

    // 尝试从redis中获取
    try {
      const redisUserData = await this.getH5UserRedis(u_id)
      if (redisUserData !== null) {
        returnData = redisUserData
      } else {
        returnData = await UserModel.findOne({username}, filterConf).lean(true)
      }
      res.json({
        data: returnData,
        msg: 'succeed!'
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
}

module.exports = new LoginService()
