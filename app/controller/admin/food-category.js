const FoodCategoryService = require('../../service/admin/food-category')

class FoodCategoryController {
  // 商品种类列表
  categoryList (req, res) {
    try {
      _common.validate({
        shop_id: {
          type: 'number',
          convertType: 'number'
        },
        name: 'string?',
        page_num: {
          type: 'number',
          convertType: 'number',
          required: false
        },
        page_size: {
          type: 'number',
          convertType: 'number',
          required: false
        }
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
  // 删除商品种类
  deleteCategory (req, res) {
    try {
      _common.validate({
        id: 'number',
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    FoodCategoryService.deleteCategory(req, res)
  }
  // 新增商品种类
  addCategory (req, res) {
    try {
      _common.validate({
        shop_id: 'number',
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
}

module.exports = new FoodCategoryController()
