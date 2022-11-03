const FoodModel = require('../../model/admin/food')
const FoodCategoryModel = require('../../model/admin/food-category')
const FoodCategoryService = require('./food-category')
const { getQueryFromUser } = require('./common')

class FoodService {
  // 商品列表
  async foodList (req, res) {
    const {  pageNum = 1, pageSize = 10, shop_id, food_category_id, name } = req.query
    const admin_uid = req.session.admin_uid
    const uid_obj = await getQueryFromUser('admin_uid', admin_uid)
    const query_obj = {
      shop_id,
      food_category_id,
      name: name ? new RegExp(name, 'i') : null,
      ...uid_obj
    }
    for (const key in query_obj) {
      if (!query_obj[key] && query_obj[key] !== 0) {
        delete query_obj[key]
      }
    }
    try {
      const count = await FoodModel.find(query_obj).count()
      const data = await FoodModel.aggregate([
        {
          $lookup: {
            from: 'food_category',
            localField: 'food_category_id',
            foreignField: 'id',
            as: 'food_category',
          }
        },
        {
          $lookup: {
            from: 'shop',
            localField: 'shop_id',
            foreignField: 'id',
            as: 'shop',
          }
        },
        {
          $unwind: '$food_category'
        },
        {
          $unwind: '$shop'
        },
        {
          $addFields: {
            food_category_name: '$food_category.name',
            shop_name: '$shop.name'
          }
        },
        {
          $match: query_obj
        },
        {
          $sort: { id: -1 }
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            food_category: 0,
            shop: 0
          }
        },
        {
          $skip: (pageNum - 1) * pageSize
        },
        {
          $limit: pageSize
        }
      ])
      res.json({
        data: {
          list: data,
          total: count,
          pageNum,
          pageSize
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
  // 商品详情
  async foodDetail (req, res) {
    let { id } = req.query
    try {
      let data = await FoodModel.findOne({ id }, '-_id -__v').lean(true)
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
  // 添加商品
  async addFood (req, res) {
    const params = req.body
    const admin_uid = req.session.admin_uid
    params.admin_uid = admin_uid
    try {
      const { shop_id, food_category_name: name, food_category_desc: description } = params
      if (name) {
        // 新增商品种类
        const { id } = await FoodCategoryService.addCategory({ shop_id, name, description })
        params.food_category_id = id
      }
      // 新增商品
      const food_result = await FoodModel.create(params)
      // 更新商品种类关联字段
      const category = await FoodCategoryModel.findOne({ id: params.food_category_id })
      category.foods.push(food_result)
      category.markModified('foods')
      await category.save()
      res.json({
        msg: '新增商品成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
  // 更新商品
  async updateFood (req, res) {
    const params = req.body
    try {
      const { id, shop_id, food_category_name: name, food_category_desc: description } = params
      // 查询商品更新前的种类id
      const { food_category_id: food_category_id_old } = await FoodModel.findOne({ id }).lean(true)
      if (name) {
        // 新增商品种类
        const { id } = await FoodCategoryService.addCategory({ shop_id, name, description })
        params.food_category_id = id
      }
      // 更新商品
      const food_result = await FoodModel.findOneAndUpdate({ id: params.id }, params)
      // 商品种类发生变更
      if (params.food_category_id !== food_category_id_old) {
        // 删除旧商品种类的关联字段
        const old_category = await FoodCategoryModel.findOne({ id: food_category_id_old })
        const sub_food = old_category.foods.id(food_result._id)
        await sub_food.remove()
        await old_category.save()
        // 更新商品种类关联字段
        const category = await FoodCategoryModel.findOne({ id: params.food_category_id })
        category.foods.push(food_result)
        category.markModified('foods')
        await category.save()
      }
      res.json({
        msg: '更新商品成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
  // 删除商品
  async deleteFood (req, res) {
    const { id } = req.body
    try {
      const food = await FoodModel.findOne({ id })
      // 更新商品种类关联字段
      const category = await FoodCategoryModel.findOne({ id: (food.food_category_id) })
      const sub_food = category.foods.id(food._id)
      await sub_food.remove()
      await category.save()
      // 删除商品
      await food.remove()
      res.json({
        msg: '删除商品成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: err,
        errLog: err
      })
    }
  }
}

module.exports = new FoodService()
