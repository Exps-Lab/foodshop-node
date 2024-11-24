// 1. 4位随机数
// 2. svg填充
//   2.1. 填充数字
//   2.2. 填充背景干扰线
// 3. 生成svg字符串返回

class Captcha {
  constructor() {
    this.init()
  }
  codeLength = 4
  originCodeStr = 'abcdefghijklmnopqrstuvwxyz0123456789'
  // 返回[min, max]随机整数
  areaRandom (min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min)
  }
  // 随机验证码
  randomCode () {
    let res = ''
    for (let i=0; i<this.codeLength; i++) {
      let randomIndex = this.areaRandom(0, this.originCodeStr.length-1)
      res += this.originCodeStr.charAt(randomIndex)
    }
    return res
  }
  // 随机颜色
  randomColor () {
    let color = '#'
    for (let i=0; i<3; i++) {
      color += this.areaRandom(1, 9).toString(16)
    }
    return color
  }
  // 计算每个文字元素随机属性
  // 返回一个<text>字符串数组
  getText (text) {
    let strArr = []
    text.split('').forEach((letter, index) => {
      const randomY= this.areaRandom(20, 30)
      const randomSize = this.areaRandom(18, 26)
      const randomRotate= this.areaRandom(0, 10)

      strArr.push(`<text x="${2+index*20}" y="${randomY}" font-size="${randomSize}" rotate="${randomRotate}">${letter}</text>`)
    })
    return strArr
  }
  // 返回干扰线数组
  getLines (lineNum= 1, width, height) {
    let cPathArr = []
    for (let i=0; i<lineNum; i++) {
      const start = `${this.areaRandom(1, 10)} ${this.areaRandom(1, height - 1)}`;
      const mid1 = `${this.areaRandom((width / 2) - 11, (width / 2) + 11)} ${this.areaRandom(1, height-1)}`;
      const mid2 = `${this.areaRandom((width / 2) - 31, (width / 2) + 31)} ${this.areaRandom(1, height/2)}`;
      const end = `${this.areaRandom(width - 21, width - 1)} ${this.areaRandom(1, height - 1)}`;
      const strokeWidth = this.areaRandom(1, 3)
      const color = this.randomColor()

      cPathArr.push(`<path d="M${start} C${mid1}, ${mid2}, ${end}" stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>`)
    }
    return cPathArr
  }
  // 返回svg
  createCaptcha (code, options) {
    const width = 85
    const height = 35
    const bg = '#efefef'

    const bgRect = bg ?
      `<rect width="100%" height="100%" fill="${bg}"/>` : '';
    const paths =
      [].concat(this.getLines(3, width, height))
        .concat(this.getText(code, width, height))
        .join('');
    const start = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0,0,${width},${height}">`;
    return `${start}${bgRect}${paths}</svg>`;
  }
  init () {
    const code = this.randomCode()
    const svg = this.createCaptcha(code)
    return {
      code,
      svg
    }
  }
}

module.exports = new Captcha()
