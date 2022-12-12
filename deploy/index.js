
const path = require('path')
const { Client } = require('ssh2')
const chalk = require('chalk')

const conn = new Client();
const fileName = 'app.tar'
const serverDir = '/usr/local/lighthouse/softwares/nodejs/app/exp-express/'
const distFile =  path.resolve(__dirname, `../${fileName}`)
const serverNodeDir =  path.resolve(__dirname, serverDir)
const serverNodeFile =  path.resolve(__dirname, `${serverDir}${fileName}`)
// 远程服务器配置
const serverConf = {
  host: '43.138.5.12',
  port: 22,
  username: 'root',
  password: 'Haihan12345,.tx'
}

try {
  conn.on('ready', async () => {
    console.log(chalk.green(`准备开始连接远程服务器：${serverConf.host}`))
    console.log(chalk.green(`具体远程部署位置：${serverNodeDir}`))

    await sftp()
    await tarShell()
    await console.log(chalk.green(`部署完成!`))
  }).connect(serverConf);
} catch (e) {
  conn.end()
  console.log(chalk.red(e.message))
}

// 用sftp上传文件
function sftp () {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) throw err;
      sftp.fastPut(distFile, serverNodeFile, (err) => {
        if (err) {
          console.log(chalk.red(err))
          reject(err)
        } else {
          console.log(chalk.green(`文件已上传：${serverNodeDir}`))
          resolve()
        }
      });
    });
  })
}

// 解压部署操作
function tarShell () {
  return new Promise((resolve, reject) => {
    conn.shell((err, stream) => {
      if (err) {
        reject(err)
      } else {
        stream.end(
          `
          j /usr/local/lighthouse/softwares/nodejs/app/exp-express/
          tar -xvf app.tar
          chmod 777 app
          rm -rf app.tar
          exit
          `
        ).on('data', data => {
          // console.log(chalk.green(data.toString()))
          resolve()
        }).on('close', () => {
          conn.end()
        })
      }
    })
  })
}
