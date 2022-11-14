const FoodCategoryModel = require('../../model/admin/food-category')
const FoodModel = require('../../model/admin/food')

class FoodCategoryService {
  // 商品种类列表
  async categoryList (req, res) {
    const { shop_id, name, page_num = 1, page_size = 10 } = req.query
    try {
      let query_obj = { shop_id }
      if (name) {
        query_obj.name = new RegExp(name, 'i')
      }
      const count = await FoodCategoryModel.find(query_obj).count()
      let data = await FoodCategoryModel.find(query_obj, '-_id -__v').sort('-id').skip((page_num - 1) * page_size).limit(page_size).lean(true)
      // 关联商品名称
      for (const item of data) {
        const food_ids = item.foods.map(food => {
          return food.id
        })
        // 根据id查询商品列表
        const foodList = await FoodModel.find({ id: food_ids })
        const foods_names = foodList.map(item => item.name)
        item.foods_names = foods_names
      }
      res.json({
        data: {
          list: data,
          page_num,
          page_size,
          total: count
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
  // 删除商品种类
  async deleteCategory (req, res) {
    const { id } = req.body
    try {
      const data = await FoodCategoryModel.findOne({ id }).lean(true)
      if (data?.foods.length > 0) {
        throw new Error('该商品种类已关联商品')
      }
      await FoodCategoryModel.deleteOne({ id })
      res.json({
        msg: '删除成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
  // 新增商品种类(用于外部service调用)
  async addCategory (data) {
    const { shop_id, name, description } = data
    try {
      const data = await FoodCategoryModel.create({ shop_id, name, description })
      return data
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = new FoodCategoryService()
