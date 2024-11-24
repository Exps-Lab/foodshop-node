const H5UserModel  = require('../../model/h5/user/login')
const AdminUserModel  = require('../../model/admin/user')
const RoleModel = require('../../model/admin/role')
const AccountService = require('../../service/h5/user/account')
const { h5UserInfoPreKey } = require('../../redis-prekey')

class LoginBase {
  // origin: admin/h5
  constructor(origin) {
    if (typeof origin === "undefined") {
      throw new Error('origin是必传项!')
    }
    this.origin = origin
    this.h5UserInfoPreKey = h5UserInfoPreKey
    this.UserModel = this.origin === 'h5' ? H5UserModel : AdminUserModel
  }

  async baseLogin (req, res) {
    const { username } = req.body

    if (this.origin === 'h5') {
      if (!this.checkCapture(req)) {
        res.json({
          code: 20002,
          msg: '验证码错误！'
        })
        return false
      }
    }

    const resData = await this.UserModel.findOne({ username })
    if (resData) {
      this.checkUser(req, res, resData)
    } else {
      this.addUser(req, res)
    }
  }

  // 添加用户(h5/admin)
  async addUser (req, res) {
    const { username, password } = req.body
    let comData = {
      username,
      avatar: '',
      c_time: Date.now(),
    }
    if (this.origin === 'admin') {
      const { role, role_name } = await this.getUserRole()
      comData = Object.assign(comData, {
        role,
        role_name
      })
    }

    this.UserModel.create({
      ...comData,
      password
    }).then(async data => {
      const { u_id } = data
      req.session.username = username
      req.session.u_id = u_id

      // h5用户创建时添加二级redis缓存
      if (this.origin === 'h5') {
        const moneyData = await AccountService.initAccountMoney(u_id)
        this.setH5UserRedis(u_id, {
          u_id,
          ...comData,
          ...moneyData
        })
      }

      res.json({
        data: comData,
        msg: 'login success'
      })
    })
  }

  // 判断用户是否存在(h5/admin)
  checkUser (req, res, resData) {
    const { password } = req.body
    const { username, u_id, avatar } = resData

    let comData = {
      username,
      avatar,
      c_time: Date.now(),
    }

    if (password === resData.password) {
      req.session.username = username
      req.session.u_id = u_id
      res.json({
        data: resData,
        msg: 'login success'
      })

      // h5用户创建时添加二级redis缓存
      if (this.origin === 'h5') {
        this.setH5UserRedis(u_id, {
          u_id,
          ...comData
        })
      }
    } else {
      res.json({
        code: 20001,
        msg: '用户名,密码错误或该用户名已被注册!'
      })
    }
  }

  // 登出
  async baseLogout (req, res) {
    const { u_id } = req.session
    await this.delH5UserRedis(u_id)
    await req.session.destroy()
    res.json({
      msg: 'logout success'
    })
  }

  // 判断验证码
  checkCapture (req) {
    const { code } = req.body
    const sessionCode = req.session.captureCode
    return code === sessionCode
  }

  // 获取admin普通用户角色配置
  async getUserRole () {
    const adminRole = await RoleModel.find().lean()
    for (let i=0; i<adminRole.length; i++) {
      // role: 1超管 2普通用户
      if (adminRole[i].role === 2) {
        return adminRole[i]
      }
    }
  }

  // 设置h5用户redis数据
  setH5UserRedis (u_id, data) {
    const { RedisInstance } = _common
    try {
      // h5UserInfoKey = `user:h5:userInfo:${u_id}`
      const { key, expireTime } = this.h5UserInfoPreKey
      const h5UserInfoKey = `${key}:${u_id}`

      // 添加并设置过期时间
      return RedisInstance.hSet(h5UserInfoKey, data, '', expireTime)
    } catch (err) {
      console.log(err)
      return err
    }
  }

  // 获取h5用户redis数据
  async getH5UserRedis (u_id) {
    const { RedisInstance } = _common
    return Promise.resolve().then(async () => {
      const h5UserInfoKey = `${this.h5UserInfoPreKey.key}:${u_id}`

      const userData = await RedisInstance.hGetAll(h5UserInfoKey)
      return userData?.u_id ? userData : null
    })
  }

  // 删除h5用户redis数据
  async delH5UserRedis (u_id) {
    const { RedisInstance } = _common
    return Promise.resolve().then(async () => {
      const h5UserInfoKey = `${this.h5UserInfoPreKey.key}:${u_id}`
      return await RedisInstance.del(h5UserInfoKey)
    })
  }
}

module.exports = LoginBase


