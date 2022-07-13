const initMenu = require('./menu')
const initRole = require('./role')
const initUser = require('./user')
const initCity = require('./city')

const initFn = {
  initMenu,
  initRole,
  initUser,
  initCity,
}

module.exports = function init () {
  Object.values(initFn).forEach(fn => {
    fn.constructor === Function && fn()
  })
}
