const CityModel = require('../app/model/common/city')
const cities = require('./originData/city.min')

module.exports = async function initCity () {
  return CityModel.find()
    .then(async res => {
      if (!res.length) {
        await CityModel.create([{
          cityData: cities
        }])
      }
    })
    .catch(err => {
      console.error(chalk.red('初始化默认城市失败: ' + err))
    })
}
