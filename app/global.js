const helper = require('./helper/index')
const request = require('./helper/fetch')
const logger = require('../logger')
const redis = require('../redis')

global._common = {
  ...helper,
  ...logger,
  ...request,
  ...redis
}
