// 处理请求跨域

const handleCros = (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
	res.header("Access-Control-Allow-Origin", allowOrigin);
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
	res.header("X-Powered-By", 'Express');

	if (req.method == 'OPTIONS') {
  	res.sendStatus(200);
	} else {
    next();
	}
}

module.exports  = handleCros