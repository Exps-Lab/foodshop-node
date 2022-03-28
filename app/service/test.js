const { handleResponse } = require('../helper/index')
const modelKyVideo  = require('../model/test')

class TestService {
  async showTest(req, res) {
    const query = await modelKyVideo.find({}).lean(true);
    if (!query.length) {
      const model = new modelKyVideo({ voteNum: 10000 });
      const saveData = await model.save();
      res.json(handleResponse({ data: saveData }))
    }
    res.json(handleResponse({ data: query[0] }))
  }
}

module.exports = new TestService()