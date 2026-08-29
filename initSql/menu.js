const MenuModel = require('../app/model/admin/menu')

// 初始化默认菜单
const defaultMenuConf = [{
  path: '/menu/index',
  label: '菜单管理',
  icon: 'apps',
  role : 1,
  is_hidden: false,
  is_default: true
}, {
  path: '/menu/detail',
  label: '菜单详情',
  role : 1,
  is_hidden: true,
  is_default: true
}]


module.exports = async function initMenu () {
  return MenuModel.find({ path: '/menu/index' })
    .then(async res => {
      if (!res.length) {
        await MenuModel.create(defaultMenuConf)
      }
    })
    .catch(err => {
      console.error(chalk.red('初始化默认菜单失败: ' + err))
    })
}
