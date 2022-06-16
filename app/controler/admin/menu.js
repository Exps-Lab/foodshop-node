const MenuService = require('../../service/admin/menu')

class MenuControler {
  menuList (req, res) {
    MenuService.menuList(req, res)
  }
  menuDetail (req, res) {
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
    MenuService.menuDetail(req, res)
  }
  addMenu (req, res) {
    try {
      _common.validate({
        path: 'string',
        label: 'string',
        role: 'number',
        children: 'array'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    MenuService.addMenu(req, res)
  }
  updateMenu (req, res) {
    try {
      _common.validate({
        id: 'number',
        path: 'string',
        label: 'string',
        role: 'number',
        children: 'array'
      }, req)
    } catch (err) {
      res.json({
        code: 10001,
        msg: '[Request Params Error]',
        errLog: err
      })
      return
    }
    MenuService.updateMenu(req, res)
  }
  deleteMenu (req, res) {
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
    MenuService.deleteMenu(req, res)
  }
}

module.exports = new MenuControler()