const handleCros  =  require('./cros')
const handleReqLog = require('./reqLog')

const handleErr = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
}

module.exports = {
  handleErr,
  handleCros,
  handleReqLog,
}