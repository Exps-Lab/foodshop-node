const CommonConf = {}

// mongoose配置
CommonConf.mongoose = {
  url: 'mongodb://127.0.0.1:27017/localTest',
  options: {
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
};

module.exports = CommonConf



