const CityBase = require('../../../service/base-class/city-base')
const PosBase = require('../../../service/base-class/pos-base')

class MainUserController {
  async getAllCity (req, res) {
    const cityBaseInstance = new CityBase()
    await cityBaseInstance.getAllCity(req, res)
  }

  async getPosByIp (req, res) {
    const posBaseInstance = new PosBase()
    const posInfo = await posBaseInstance.getPosByIp(req, res)
    res.json({
      data: posInfo
    })
  }
}

module.exports = new MainUserController()
