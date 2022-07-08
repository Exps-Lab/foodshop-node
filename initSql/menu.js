const MenuModel = require('../app/model/admin/menu')

// 初始化默认菜单
const defaultMenuConf = [{
  path: '/menu/index',
  label: '菜单管理',
  icon: 'apps',
  role : 1,
  is_default: true
}, {
  path: '/menu/detail',
  label: '菜单详情',
  role : 1,
  is_default: true,
  is_hidden: true
}]


module.exports = function initMenu () {
  MenuModel.find({ path: '/menu/index' }).then(res => {
    if (!res.length) {
      MenuModel.create(defaultMenuConf)
    }
  })
}

