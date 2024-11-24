const CategoryModel = require('../app/model/common/category')
const category = require('./originData/category.min')

module.exports = function initCategory () {
  CategoryModel.find().then(async res => {
    if (!res.length) {
      await CategoryModel.create(category)
    } else {
      const hasImageUrl = res[0].image_url !== undefined
      if (!hasImageUrl) {
        await CategoryModel.deleteMany({})
        await CategoryModel.create(category)
      }
    }
  })
}

