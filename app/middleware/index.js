const handleCros  =  require('./cros')
const handleCatchReq = require('./catchReq')

const getNowTime = (options) => {
  return (req, res, next) => {
    if (options.type === 1) {
      // console.log(1)
    } else {
      console.log(2)
    }
    res.testName = 'changeRes21321'
    next();
  }
}

const handleErr = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
}

module.exports = {
  getNowTime,
  handleErr,
  handleCros,
  handleCatchReq
}