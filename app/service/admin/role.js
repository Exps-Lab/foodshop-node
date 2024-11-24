const RoleModel  = require('../../model/admin/role')

class RoleService {
  async getRoleList(req, res) {
    try {
      const data = await RoleModel.find({id: -1}, '-_id -__v').lean(true)
      res.json({ data })
    } catch (err) {
      res.json({
        code: 20002,
        errLog: err
      })
    }
  }
}

module.exports = new RoleService()
