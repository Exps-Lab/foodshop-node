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

async function request (url, data, options) {
  let defaultOptions = {
    method: 'GET',
    headers: {}
  }
  const method = /post/gi.test(options?.method) ? 'post' : 'get'

  if (data && data.constructor === Object) {
    if (method === 'get') {
      Object.keys(data).forEach((key, index, arr) => {
        url += `?${key}=${data[key]}${index !== arr.length - 1 && '&'}`
      })
    } else if (method === 'post') {
      defaultOptions.body = JSON.stringify(data)
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
  const jsonData = await res.json();

  // 请求三方api默认status
  if (res?.status !== 200 || jsonData?.status !== 0) {
    const errText= `http message: ${res.statusText} -- data message: ${jsonData.message}`
    _common.WebLogger.error('[REQUEST_ERR]', errText);
    throw new Error(errText)
  }

  return jsonData.result || jsonData.results
}

module.exports = {
  request
}
