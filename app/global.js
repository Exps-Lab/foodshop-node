const helper = require('./helper/index')
const logger = require('../logger')

global._common = {
  ...helper,
  ...logger,
}