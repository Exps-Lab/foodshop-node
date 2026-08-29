const mongoose = require('mongoose')
const chalk = require('chalk')
const seedData = require('../initSql/index')
// require mongoDB 会触发 connectDB()，此处只需等待连接就绪
require('../mongoDB')

function waitForConnection() {
  if (mongoose.connection.readyState === 1) return Promise.resolve()
  return new Promise((resolve, reject) => {
    mongoose.connection.once('open', resolve)
    mongoose.connection.once('error', reject)
  })
}

async function init() {
  await waitForConnection()
  console.log(chalk.green('数据库连接成功，开始初始化...'))

  await seedData()
  
  console.log(chalk.green('数据库初始化完成'))
  await mongoose.disconnect()
  process.exit(0)
}

init().catch(err => {
  console.error(chalk.red('数据库初始化失败：', err))
  process.exit(1)
})
