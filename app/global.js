const helper = require('./helper/index')
const request = require('./helper/fetch')
const logger = require('../logger')

global._common = {
  ...helper,
  ...logger,
  ...request
}
