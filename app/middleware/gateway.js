const { sessionConf } = require('../../conf/index')

// 处理请求跨域
const handleCros = (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
	res.header("Access-Control-Allow-Origin", allowOrigin);
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
	res.header("X-Powered-By", 'Express');

	if (req.method === 'OPTIONS') {
  	res.sendStatus(200);
	} else {
    next();
	}
}

// session拦截校验
const handleSession = (req, res, next) => {
  const { path, sessionID, cookies } = req
  const moduleName = path.split('/')[1]
  // console.log(sessionConf)
  // console.log(moduleName)
  console.log(sessionConf[moduleName])
  const sessionKey = sessionConf[moduleName].name
  const cookie = cookies[sessionKey]?.split(/[:.]/)[1]

  if (path.includes('/auth/') && sessionID !== cookie) {
    res.json({
      code: 10002,
      msg: '[Illegal Token]'
    })
  }
  // API格式未区分auth时，打印warning日志
  if (!/(\/auth\/)|(\/noauth\/)/.test(path)) {
    _common.AppLogger.warn('[BAD_API_FORMAT]', Error(path))
  }
  next()
}

module.exports  = { handleCros, handleSession }
