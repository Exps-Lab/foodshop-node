const CategoryModel = require('../app/model/common/category')
const category = require('./originData/category.min')

module.exports = function initCategory () {
  CategoryModel.find().then(res => {
    if (!res.length) {
      CategoryModel.create(category)
    }
  })
}

