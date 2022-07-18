const qiniu = require('qiniu')
const CommonConf = require('../../../conf/index')
const UserModel  = require('../../model/admin/user')
const MenuModel  = require('../../model/admin/menu')

class CommonInfoService {
  /* 获取菜单&用户信息 */
  async getCommonInfo(req, res) {
    const username = req.session.username
    const filterConf = '-_id -__v'

    try {
      const loginUserInfo = await UserModel.find({ username }, filterConf).lean(true)

      const authMenuFilter = loginUserInfo[0].role === 1 ? {} : { role: loginUserInfo[0].role }
      const authMenu = await MenuModel.find(authMenuFilter, filterConf).lean(true)
      res.json({
        data: {
          menuList: authMenu,
          userInfo: loginUserInfo[0]
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }

  /* 获取文件上传token */
  uploadToken (req, res) {
    // 上传凭证
    const { accessKey, secretKey, bucket } = CommonConf.qiniuConf
    const options = {
      scope: bucket,
      expires: 7200
    }
    try {
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
      const putPolicy = new qiniu.rs.PutPolicy(options)
      const uploadToken = putPolicy.uploadToken(mac)
      res.json({
        data: uploadToken
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
}

module.exports = new CommonInfoService()
