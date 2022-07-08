const initMenu = require('./menu')
const initRole = require('./role')
const initUser = require('./user')

const initFn = {
  initMenu,
  initRole,
  initUser,
}

module.exports = function init () {
  Object.values(initFn).forEach(fn => {
    fn.constructor === Function && fn()
  })
}

