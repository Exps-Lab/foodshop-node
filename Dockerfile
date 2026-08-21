# 使用 Node.js 18 LTS 版本（与项目依赖兼容）
FROM node:18.20-alpine

# 设置工作目录
WORKDIR /app

# 安装 PM2 全局依赖
RUN npm install -g pm2

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
RUN npm config set registry https://registry.npmmirror.com && npm install --production

# 复制应用代码
COPY . .

# 创建日志目录
RUN mkdir -p logs/web logs/app logs/db

# 暴露应用端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 使用 PM2 启动应用
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
