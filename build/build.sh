# 上传前处理

# 压缩dist文件
tar -cvf app.tar ./app
# 上传服务器
node './deploy/index.js'
# 删除tar包
rm './app.tar'
