const Parameter = require('parameter');
const { Snowflake } = require('@sapphire/snowflake')
const CtoPin = require('./dictionary')
const calcGoodsFuns = require('./calcGoodsPrice')

// 处理时间格式
Date.prototype.formatTime = formatTime;
function formatTime (fmt) {
  let o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

// 验证请求参数
function validate (rule={}, req) {
  const data = req.method === 'GET' ? req.query : req.body
  const validateResult = new Parameter().validate(rule, data)
  if (validateResult !== undefined) {
    throw new Error(JSON.stringify(validateResult))
  }
}

/**
 * 加密手机号中间四位
 * @param phone
 * @returns {string}
 */
function cryptoPhone (phone = null) {
  if (!phone) {
    throw new Error('手机号是必传的')
  }
  const strPhone = phone.toString()
  return strPhone.slice(0, 3) + '****' + strPhone.slice(7)
}

// 生成订单id, 19位
// 商铺id + 用户id + 雪花算法
function generateOrderNumber(shopId, uId) {
  if (!shopId || !uId) return new Error('shopId和用户id是必传的!')
  const uniqStr = snowFlake().slice(4)
  return String(`${shopId}${uId}${uniqStr}`)
}

// 雪花算法生成唯一id
function snowFlake () {
  const epoch = new Date().getUTCDate()
  const snowflake = new Snowflake(epoch)
  return snowflake.generate().toString()
}

module.exports = {
  formatTime,
  validate,
  CtoPin,
  cryptoPhone,
  snowFlake,
  generateOrderNumber,
  ...calcGoodsFuns
}
