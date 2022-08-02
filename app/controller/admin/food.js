const FoodService = require('../../service/admin/food')

class FoodController {
  constructor () {}
  static food_rules = {
    shop_id: 'number',
    food_category_id: {
      type: 'number',
      convertType: 'number',
      required: false
    },
    food_category_name: 'string?',
    food_category_desc: 'string?',
    name: 'string',
    description: 'string?',
    material: 'string?',
    measure: 'string?',
    image_path: 'string?',
    is_discount: 'boolean',
    discount_num: 'number?',
    attrs: {
      type: 'array',
      itemType: 'string'
    },
    specfoods: {
      type: 'array',
      itemType: 'object',
      rule: {
        name: 'string',
        packing_fee: 'number',
        price: 'number',
        stock: 'number'
      }
    },
  }
  // 商品列表
  foodList (req, res) {
    try {
      _common.validate({
        shop_id: {
          type: 'number',
          convertType: 'number',
          required: false
        },
        food_category_id: {
          type: 'number',
          convertType: 'number',
          required: false
        },
        name: 'string?',
        pageNum: {
          type: 'number',
          convertType: 'number',
          required: false
        },
        pageSize: {
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
    FoodService.foodList(req, res)
  }
  // 商品详情
  foodDetail (req, res) {
    try {
      _common.validate({
        id: 'string'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    FoodService.foodDetail(req, res)
  }
  // 新增商品
  addFood (req, res) {
    try {
      _common.validate(FoodController.food_rules, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    FoodService.addFood(req, res)
  }
  // 更新商品
  updateFood (req, res) {
    try {
      _common.validate({ 
        id: 'number',
        ...FoodController.food_rules
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    FoodService.updateFood(req, res)
  }
  // 删除商品
  deleteFood (req, res) {
    try {
      _common.validate({
        id: 'number'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    FoodService.deleteFood(req, res)
  }
}

module.exports = new FoodController()
