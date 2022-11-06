const CityModel = require('../app/model/common/city')
const cities = require('./originData/city.min')

module.exports = function initCity () {
  CityModel.find().then(res => {
    if (!res.length) {
      CityModel.create([{
        cityData: cities
      }])
    }
  })
}

