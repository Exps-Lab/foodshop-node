const CategoryModel  = require('../../model/common/category')
const BaseClass = require('./base')

class ShopBase extends BaseClass {
  constructor(props) {
    super(props);
  }
  // 获取所有商铺分类
  async getShopCategory (req, res) {
    try {
      const data = await CategoryModel.find({}, '-_id -__v').lean(true)
      const wrapperData = data.filter(item => {
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
      res.json({
        data: wrapperData
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

module.exports = ShopBase
