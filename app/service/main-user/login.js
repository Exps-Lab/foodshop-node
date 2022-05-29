const UserModel  = require('../../model/main-user/login')

class LoginService {
  async addUser(req, res) {
    const encryptPassword = new Buffer.from('test').toString('base64')
    UserModel.create({
      username: 'test',
      password: encryptPassword
    }).then(data => {
      res.end('add succeed!')
    })
  }
}

module.exports = new LoginService()