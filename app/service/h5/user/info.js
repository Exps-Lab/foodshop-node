const UserModel  = require('../../../model/h5/user/login')
const LoginBase = require("../../base-class/login-base")

class UserInfoService extends LoginBase {
  constructor() {
    super('h5')
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

  // 更新用户名
  async updateUserName (req, res) {
    const { u_id } = req.session
    const { username } = req.body
    const resData = await this.updateUserField(u_id, 'username', username)
    res.json(resData)
  }

  // 更新头像
  async updateUserAvatar (req, res) {
    const { u_id } = req.session
    const { avatar } = req.body
    const resData = await this.updateUserField(u_id, 'avatar', avatar)
    res.json(resData)
  }

  // 更新（单个）用户信息工具函数
  async updateUserField (u_id, key, value) {
    const { RedisInstance } = _common
    try {
      const resData = await UserModel.findOneAndUpdate(
        { u_id },
        {
          $set: {
            [key]: value
          }
        },
        { new: true }
      ).lean(true)
      await RedisInstance.hSet(`${this.h5UserInfoPreKey}:${u_id}`, key, value)
      return({
        data: resData,
        msg: 'succeed!'
      })
    } catch (err) {
      return({
        code: 20002,
        resData: err
      })
    }
  }
}

module.exports = new UserInfoService()
