const Parameter = require('parameter');
const CtoPin = require('./dictionary')

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
 * 两个定位(gps)的直线距离
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 * @returns {number}
 */
function getTwoPosDistance(lat1,  lng1,  lat2,  lng2){
  const radLat1 = lat1 * Math.PI / 180.0;
  const radLat2 = lat2 * Math.PI / 180.0;
  const a = radLat1 - radLat2;
  const b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137 ; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return Number(s.toFixed(2))
}

module.exports = {
  formatTime,
  validate,
  CtoPin,
  getTwoPosDistance
}
