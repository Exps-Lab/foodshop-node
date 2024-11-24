const { handleCros, handleSession } = require('./gateway')
const { handleReqLog, handleResponse } = require('./resFilter')

module.exports = {
  handleCros,
  handleSession,
  handleReqLog,
  handleResponse
}