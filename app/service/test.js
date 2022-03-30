const modelKyVideo  = require('../model/test')

class TestService {
  async showTest(req, res) {
    const query = await modelKyVideo.find({}).lean(true);
    if (!query.length) {
      const model = new modelKyVideo({ voteNum: 10000 });
      const saveData = await model.save();
      res.json(_common.handleResponse({ data: saveData }))
    }
    res.json(_common.handleResponse({ data: query[0] }))
  }
}

module.exports = new TestService()