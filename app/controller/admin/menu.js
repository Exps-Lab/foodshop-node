const MenuService = require('../../service/admin/menu')

class MenuController {
  menuList (req, res) {
    try {
      _common.validate({
        page_num: {
          type: 'number',
          convertType: 'number',
          required: false
        },
        page_size: {
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
        icon: 'string?',
        role: 'number',
        is_hidden: 'boolean',
        children: 'array?'
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
        icon: 'string?',
        role: 'number',
        is_hidden: 'boolean',
        children: 'array?'
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

module.exports = new MenuController()
