const FoodCategoryService = require('../../service/admin/food-category')

class FoodCategoryController {
  // 获取商品种类列表
  categoryList (req, res) {
    try {
      req.query.ids = JSON.parse(req.query.ids)
      _common.validate({
        ids: {
          type: 'array',
          itemType: 'number',
          required: false
        },
        name: 'string?'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    FoodCategoryService.categoryList(req, res)
  }
  // 新增商品种类
  addCategory (req, res) {
    try {
      _common.validate({
        name: 'string',
        description: 'string?'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    FoodCategoryService.addCategory(req, res)
  }
  /* // 更新商品种类关联的商品id
  updateCategory (req, res) {
    try {
      _common.validate({
        food_id: 'number?'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    FoodCategoryService.addCategory(req, res)
  } */
}

module.exports = new FoodCategoryController()
