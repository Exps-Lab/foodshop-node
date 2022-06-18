const MenuModel = require('../../model/admin/menu')

class MenuService {
  async menuList (req, res) {
    let query = req.query
    try {
      // const data = await MenuModel.find().lean(true)
      // data.forEach(item => {
      //   item.children = JSON.parse(item.children)
      // })
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
      }])
      data.forEach(item => {
        item.children = JSON.parse(item.children)
      })
      res.json({
        data,
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
      data.children = JSON.parse(data.children)
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
    params.children = JSON.stringify(params.children)
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
    params.children = JSON.stringify(params.children)
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