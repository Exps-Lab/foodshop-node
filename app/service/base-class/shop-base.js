const CategoryModel  = require('../../model/common/category')
const ShopModel = require('../../model/admin/shop')
const PosBase = require("./pos-base")

class ShopBase extends PosBase {
  constructor(props) {
    super(props);
  }

  // 获取筛选后的商铺列表
  // 支持筛选：current_pos当前位置(lat, lng)，商铺类型(shop_type)
  async getFilterShopList (filterParams) {
    const { distance, current_pos, shop_type } = filterParams
    let filterData = null
    try {
      // 优先处理 除位置 的其他条件
      if (shop_type) {
        filterData = await ShopModel.find({ category: { $elemMatch: { $eq: shop_type }}}).lean(true)
      } else {
        filterData = await ShopModel.find().lean(true)
      }

      if (distance) {
        const [ lat, lng ] = current_pos.split(',')
        // 计算位置距离
        for (const item of filterData) {
          item.distance = PosBase.getTwoPosDistance(Number(lat), Number(lng), item.pos.lat, item.pos.lng)
        }
        filterData?.sort((value1, value2) => {
          return distance === 1 ? (value1.distance - value2.distance) : (value2.distance - value1.distance)
        })
      }
      return filterData
    } catch (err) {
      throw new Error(err)
    }
  }

  // 获取所有商铺分类
  async getShopCategory () {
    try {
      const data = await CategoryModel.find({}, '-_id -__v').lean(true)
      return data.filter(item => {
        // 过滤掉"全部"
        if (item.image_url) {
          item.image_url = `${this.h5ImgHost}/${item.image_url}`
          // 处理子分类的图片链接
          if (item.sub_categories) {
            item.sub_categories.forEach(subItem => {
              if (subItem.image_url) {
                subItem.image_url = `${this.h5ImgHost}/${subItem.image_url}`
              }
            })
          }
          return item
        }
      })
    } catch (err) {
      throw new Error(err)
    }
  }
  // 获取商铺子类分类
  async getShopSubCategory (categoryId) {
    try {
      const data = await CategoryModel.findOne({ id: categoryId }, '-_id -__v').lean(true)
      if (data !== null) {
        return data.sub_categories?.map(item => {
          if (item.image_url) {
            item.image_url = `${this.h5ImgHost}/${item.image_url}`
          }
          return item
        })
      } else {
        return []
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = ShopBase
