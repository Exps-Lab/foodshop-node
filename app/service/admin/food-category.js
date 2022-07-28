const FoodCategorModel = require('../../model/admin/food-category')

class FoodCategoryService {
  async categoryList (req, res) {
    const { ids, name } = req.query
    try {
      let params = {}
      if (name) {
        params.name = new RegExp(name, 'i')
      }
      if (ids) {
        params.id = { $in: ids }
      }
      const data = await FoodCategorModel.find(params, '-_id -__v').lean(true)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
  async addCategory (req, res) {
    const params = req.body
    try {
      await FoodCategorModel.create(params)
      res.json({
        msg: '保存成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
}

module.exports = new FoodCategoryService()
