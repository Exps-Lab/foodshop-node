const CollectModel  = require('../../../model/h5/user/collect')

class AccountService {
  async isShopCollected (u_id, shop_id) {
    const data = await CollectModel.findOne({
      u_id,
      shop_id
    })
    return data !== null
  }

  async addCollectShop (req, res) {
    const { u_id } = req.session
    const { shop_id } = req.body
    try {
      const data = await CollectModel.create({
        u_id,
        shop_id,
        collect_time: Date.now()
      })
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '收藏失败，请重试',
        errLog: err
      })
    }
  }

  async removeCollectShop (req, res) {
    const { u_id } = req.session
    const { shop_id } = req.body
    try {
      const data = await CollectModel.deleteOne({
        u_id,
        shop_id,
      })
      res.json({
        data
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: '取消收藏失败，请重试',
        errLog: err
      })
    }
  }

  // 收藏列表
  async getCollectList (req, res) {
    const { u_id } = req.session
    const { pageNum = 1, pageSize = 10 } = req.query

    const searchObj = {
      u_id
    }
    // 返回的分页参数
    const paginationMap = {
      pageNum,
      pageSize,
      total: 0,
      hasNext: null
    }

    try {
      const resData = await CollectModel.aggregate([
        {
          $lookup: {
            from: 'shop',
            localField: 'shop_id',
            foreignField: 'id',
            as: 'shop',
          }
        }, {
          $unwind: '$shop'
        }, {
          $match: searchObj
        }, {
          $skip: (pageNum - 1) * pageSize
        }, {
          $limit: pageSize
        }, {
          $project: {
            _id: 0,
            __v: 0,
            shop_id: 0
          }
        }
      ])
      paginationMap.total = await CollectModel.find(searchObj).count()
      paginationMap.hasNext = (paginationMap.total > pageNum * pageSize)

      res.json({
        data: {
          list: resData,
          ...paginationMap
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
}

module.exports = new AccountService()
