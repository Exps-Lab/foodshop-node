const qiniu = require('qiniu')
const CommonConf = require('../../../conf/index')

class BaseClass {
  constructor() {
    this.h5ImgHost = 'https://fuss10.elemecdn.com'
  }

  /* 获取七牛云文件上传token */
  getUploadToken (req, res) {
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
        code: 10003,
        msg: '上传token获取失败',
        errLog: err
      })
    }
  }
}

module.exports = BaseClass
