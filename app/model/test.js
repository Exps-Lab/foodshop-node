const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  // 点赞数
  voteNum: {
    type: Number,
  },
});

module.exports = mongoose.model('test', PostSchema);
