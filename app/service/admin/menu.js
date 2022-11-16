const MenuModel = require('../../model/admin/menu')

class MenuService {
  async menuList (req, res) {
    const { page_num = 1, page_size = 10 } = req.query
    try {
      const count = await MenuModel.count()
      const data = await MenuModel.aggregate([
      {
        $lookup: {
          from: 'role',
          localField: 'role',
          foreignField: 'role',
          as: 'rName',
        }
      }, {
        $unwind: '$rName'
      }, {
        $addFields: { role_name: '$rName.role_name' }
      }, {
        $project: {
          _id: 0,
          __v: 0,
          rName: 0
        }
      }, {
        $skip: (page_num - 1) * page_size
      }, {
        $limit: page_size
      }])
      data.forEach(item => {
        item.is_hidden_text = item.is_hidden ? '是' : '否'
      })
      res.json({
        data: {
          page_num,
          page_size,
          total: count,
          list: data
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
  async menuDetail (req, res) {
    let query = req.query
    try {
      let data = await MenuModel.findOne({id: query.id}).lean(true)
      res.json({
        data,
        msg: '查询成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
  async addMenu (req, res) {
    let params = req.body
    try {
      await MenuModel.create(params)
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
  async updateMenu (req, res) {
    let params = req.body
    try {
      await MenuModel.updateOne({ id: params.id }, params)
      res.json({
        msg: '更新成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
  async deleteMenu (req, res) {
    const id = req.body.id
    try {
      await MenuModel.deleteOne({ id })
      res.json({
        msg: '删除成功'
      })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
}

module.exports = new MenuService()
