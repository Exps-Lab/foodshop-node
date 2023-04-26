/**
 * 封装node请求
 * @param url 请求url
 * @param data Object请求数据，get/post都可以在这设置
 * @param options fetch支持的options https://www.npmjs.com/package/node-fetch
 * @returns {Promise<*>}
 *
 * get demo:
 * const url = 'http://apis.map.qq.com/ws/location/v1/ip'
 _common.request(url, {
      key: 'RLHBZ-WMPRP-Q3JDS-V2IQA-JNRFH-EJBHL',
      ip: '120.245.22.190'
    }).then(data => {
      res.json({
        data
      })
    })
 */

const fetch = require('node-fetch')
const querystring = require("querystring");

async function request (url, data, options) {
  let defaultOptions = {
    method: 'GET',
    headers: {}
  }
  const method = /post/gi.test(options?.method) ? 'post' : 'get'

  // 处理请求参数
  if (data && data.constructor === Object) {
    if (method === 'get') {
      Object.keys(data).forEach((key, index, arr) => {
        url += `${index === 0 ? '?': '&'}${key}=${data[key]}`
      })
    } else if (method === 'post') {
      defaultOptions.body = querystring.stringify(data)
    } else {}
  }
  if (method === 'post') {
    defaultOptions.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    }
  }
  const requestOptions = options
    ? { ...defaultOptions, ...options }
    : { ...defaultOptions }

  const res = await fetch(url, requestOptions)

  // 处理返回数据
  const resContentType = res.headers.get('content-type')
  let resData
  switch (true) {
    case resContentType.includes('text/plain'):
      resData = await res.text()
      break
    case resContentType.includes('application/json'):
      resData = await res.json()
      break
    default:
      resData = await res.json()
      break
  }

  // 请求三方api默认status
  if (res?.status !== 200 || (resData.status && resData.status !== 0)) {
    const errText= `http message: ${res.statusText} -- data message: ${resData.message}`
    _common.WebLogger.info('[REQUEST_URL]', url);
    _common.WebLogger.info('[REQUEST_INFO_ERR]', errText);
    throw new Error(errText)
  }

  return resData
}

module.exports = {
  request
}
