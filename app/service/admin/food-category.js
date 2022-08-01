const FoodCategorModel = require('../../model/admin/food-category')

class FoodCategoryService {
  // 商品种类列表
  async categoryList (req, res) {
    const { shop_id, name, pageNum = 1, pageSize = 10 } = req.query
    try {
      let query_obj = { shop_id }
      if (name) {
        query_obj.name = new RegExp(name, 'i')
      }
      const data = await FoodCategorModel.find(query_obj, '-_id -__v').sort('-id').skip((pageNum - 1) * pageSize).limit(pageSize)
      const count = await FoodCategorModel.find(query_obj).count()
      res.json({
        data: {
          list: data,
          pageNum,
          pageSize,
          total: count
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
  // 新增商品种类(用于外部service调用)
  async addCategory (data) {
    const { shop_id, name, description } = data
    try {
      const data = await FoodCategorModel.create({ shop_id, name, description })
      return data
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = new FoodCategoryService()
