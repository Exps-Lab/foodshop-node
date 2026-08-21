# Foodshop Node Docker 部署指南

## 📋 目录

- [概述](#概述)
- [系统要求](#系统要求)
- [服务版本](#服务版本)
- [快速开始](#快速开始)
- [详细部署步骤](#详细部署步骤)
- [配置说明](#配置说明)
- [常用命令](#常用命令)
- [故障排查](#故障排查)
- [生产环境建议](#生产环境建议)

---

## 概述

本项目提供完整的 Docker 容器化部署方案，包含以下服务：

- **Nginx** (1.24-alpine) - 反向代理服务器
- **Node.js** (18-alpine) - 应用服务器（PM2 集群模式）
- **MongoDB** (6.0) - 主数据库
- **Redis** (7.0-alpine) - 缓存服务
- **RabbitMQ** (3.12-management-alpine) - 消息队列

## 系统要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间

## 服务版本

| 服务 | 版本 | 说明 |
|------|------|------|
| Node.js | 18-alpine | LTS 版本，与项目依赖兼容 |
| MongoDB | 6.0 | 支持 Mongoose 6.x |
| Redis | 7.0-alpine | 支持 node-redis v4 |
| RabbitMQ | 3.12-management-alpine | 包含管理界面 |
| Nginx | 1.24-alpine | 稳定版反向代理 |
| PM2 | latest | 进程管理器 |

## 快速开始

### 一键部署

```bash
# 1. 克隆项目（如果还没有）
cd foodshop-node

# 2. 赋予部署脚本执行权限
chmod +x deploy.sh

# 3. 执行一键部署
./deploy.sh start
```

### 使用交互式菜单

```bash
./deploy.sh
```

## 详细部署步骤

### 步骤 1：环境准备

```bash
# 检查 Docker 安装
docker --version
docker-compose --version

# 如果未安装，请参考官方文档安装
# https://docs.docker.com/get-docker/
# https://docs.docker.com/compose/install/
```

### 步骤 2：配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，根据实际需求修改配置
vim .env
```

**环境变量说明：**

```bash
# Node.js 应用配置
NODE_ENV=production          # 运行环境
PORT=3000                    # Node.js 端口

# MongoDB 配置
MONGO_URL=mongodb://mongodb:28017/elm_db
MONGO_PORT=28017             # 宿主机映射端口

# Redis 配置
REDIS_HOST=redis             # Docker 网络中的主机名
REDIS_PORT=6379              # 宿主机映射端口

# RabbitMQ 配置
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672           # AMQP 协议端口
RABBITMQ_MANAGEMENT_PORT=15672  # 管理界面端口

# Nginx 配置
NGINX_PORT=80                # Web 访问端口
```

### 步骤 3：创建必要目录

```bash
# 创建日志目录
mkdir -p logs/web logs/app logs/db logs/pm2 logs/nginx
```

### 步骤 4：构建 Docker 镜像

```bash
# 构建所有服务镜像
docker-compose build

# 或者只构建 Node.js 应用镜像
docker-compose build node-app
```

### 步骤 5：启动服务

```bash
# 启动所有服务（后台运行）
docker-compose up -d

# 查看启动日志
docker-compose logs -f
```

### 步骤 6：验证服务状态

```bash
# 查看所有服务状态
docker-compose ps

# 应该看到所有服务都是 Up 状态
```

### 步骤 7：访问服务

- **Web 应用**: http://localhost:80
- **Node.js 直接访问**: http://localhost:3000
- **RabbitMQ 管理界面**: http://localhost:15672
  - 默认用户名: guest
  - 默认密码: guest

## 配置说明

### 1. Docker Compose 配置

**文件**: `docker-compose.yml`

主要配置项：
- 服务依赖关系（depends_on）
- 健康检查（healthcheck）
- 数据持久化（volumes）
- 网络配置（networks）
- 端口映射（ports）

### 2. Node.js 应用配置

**文件**: `Dockerfile`

- 基础镜像: `node:18-alpine`
- 安装 PM2 全局依赖
- 使用多阶段构建优化镜像大小
- 健康检查确保服务可用

**文件**: `ecosystem.config.js`

- PM2 集群模式配置
- 自动重启策略
- 日志管理
- 内存限制

### 3. Nginx 配置

**文件**: `nginx/nginx.conf`

- 反向代理到 Node.js 服务
- Gzip 压缩
- 静态资源缓存
- 安全头配置
- 负载均衡（keepalive）

### 4. 环境变量配置

**文件**: `.env`

所有敏感配置和可变配置都通过环境变量管理，支持：
- 数据库连接信息
- 端口配置
- 认证信息
- 环境特定配置

## 常用命令

### 服务管理

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启所有服务
docker-compose restart

# 重启单个服务
docker-compose restart node-app

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f node-app
docker-compose logs -f mongodb
```

### 构建管理

```bash
# 重新构建镜像
docker-compose build --no-cache

# 只构建特定服务
docker-compose build node-app

# 清理未使用的镜像
docker image prune -f
```

### 容器管理

```bash
# 进入容器
docker exec -it foodshop-node-app sh
docker exec -it foodshop-mongodb mongosh
docker exec -it foodshop-redis redis-cli

# 查看容器资源使用
docker stats

# 查看容器详细信息
docker inspect foodshop-node-app
```

### 数据管理

```bash
# 备份 MongoDB 数据
docker exec foodshop-mongodb mongodump --out /data/backup

# 恢复 MongoDB 数据
docker exec foodshop-mongodb mongorestore /data/backup

# 查看数据卷
docker volume ls

# 清理所有数据卷（危险操作！）
docker-compose down -v
```

## 故障排查

### 1. 服务启动失败

```bash
# 查看详细日志
docker-compose logs node-app

# 检查服务依赖
docker-compose ps

# 验证网络连接
docker network inspect foodshop-node_foodshop-network
```

### 2. MongoDB 连接失败

```bash
# 检查 MongoDB 是否运行
docker-compose ps mongodb

# 测试 MongoDB 连接
docker exec -it foodshop-mongodb mongosh

# 查看 MongoDB 日志
docker-compose logs mongodb
```

### 3. Redis 连接失败

```bash
# 检查 Redis 状态
docker-compose ps redis

# 测试 Redis 连接
docker exec -it foodshop-redis redis-cli ping

# 查看 Redis 日志
docker-compose logs redis
```

### 4. RabbitMQ 连接失败

```bash
# 检查 RabbitMQ 状态
docker-compose ps rabbitmq

# 访问管理界面
open http://localhost:15672

# 查看 RabbitMQ 日志
docker-compose logs rabbitmq
```

### 5. Nginx 502 错误

```bash
# 检查 Node.js 服务是否运行
docker-compose ps node-app

# 查看 Nginx 错误日志
docker-compose logs nginx
tail -f logs/nginx/error.log

# 验证 Nginx 配置
docker exec foodshop-nginx nginx -t
```

### 6. 端口冲突

如果端口被占用，修改 `.env` 文件中的端口配置：

```bash
# 例如修改 Nginx 端口
NGINX_PORT=8080

# 重启服务
docker-compose down
docker-compose up -d
```

## 生产环境建议

### 1. 安全配置

**启用数据库认证：**

编辑 `.env` 文件，取消注释以下配置：

```bash
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
REDIS_PASSWORD=your_redis_password
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=your_secure_password
```

修改 `docker-compose.yml`，启用认证配置。

**修改默认密码：**
- 修改所有默认密码
- 使用强密码策略
- 定期轮换密钥

### 2. 性能优化

**调整 PM2 配置：**

编辑 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'foodshop-node',
    script: './index.js',
    instances: 'max',  // 根据 CPU 核心数调整
    exec_mode: 'cluster',
    max_memory_restart: '2G',  // 根据服务器内存调整
    // ...
  }]
}
```

**优化 MongoDB：**

```yaml
# docker-compose.yml
mongodb:
  command: --wiredTigerCacheSizeGB 1.5
```

**优化 Redis：**

```yaml
# docker-compose.yml
redis:
  command: >
    redis-server
    --maxmemory 512mb
    --maxmemory-policy allkeys-lru
```

### 3. 日志管理

**配置日志轮转：**

```yaml
# docker-compose.yml
node-app:
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
```

**使用外部日志系统：**

考虑使用 ELK Stack 或 Fluentd 集中管理日志。

### 4. 备份策略

**自动备份脚本：**

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份 MongoDB
docker exec foodshop-mongodb mongodump --out /tmp/backup
docker cp foodshop-mongodb:/tmp/backup $BACKUP_DIR/mongo_$DATE

# 备份 Redis
docker exec foodshop-redis redis-cli BGSAVE
docker cp foodshop-redis:/data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# 保留最近 7 天的备份
find $BACKUP_DIR -type f -mtime +7 -delete
```

**定时任务：**

```bash
# 添加 crontab
0 2 * * * /path/to/backup.sh
```

### 5. 监控告警

**使用 Docker 内置监控：**

```bash
docker stats
```

**集成 Prometheus + Grafana：**

添加监控服务到 `docker-compose.yml`：

```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
```

### 6. 高可用部署

**多实例部署：**

```yaml
# docker-compose.prod.yml
node-app:
  deploy:
    replicas: 3
    resources:
      limits:
        cpus: '1'
        memory: 1G
```

**使用 Docker Swarm：**

```bash
# 初始化 Swarm
docker swarm init

# 部署服务
docker stack deploy -c docker-compose.yml foodshop
```

### 7. CI/CD 集成

**GitHub Actions 示例：**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and deploy
        run: |
          docker-compose build
          docker-compose up -d
```

## 附录

### 网络架构

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ Port 80
       ▼
┌─────────────────┐
│     Nginx       │
│  (反向代理)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Node.js App   │
│   (PM2 集群)    │
│    Port 3000    │
└──┬──────┬───────┘
   │      │
   ▼      ▼
┌────┐ ┌─────┐
│Mongo│ │Redis│
│DB  │ │     │
│28017│ │6379 │
└────┘ └─────┘
   │
   ▼
┌─────────┐
│RabbitMQ │
│ 5672    │
│ 15672   │
└─────────┘
```

### 数据持久化

- `mongodb_data`: MongoDB 数据文件
- `mongodb_config`: MongoDB 配置文件
- `redis_data`: Redis 持久化数据
- `rabbitmq_data`: RabbitMQ 消息数据
- `./logs`: 应用日志目录

### 相关资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [PM2 文档](https://pm2.keymetrics.io/)
- [Nginx 配置最佳实践](https://www.nginx.com/resources/wiki/start/topics/examples/full/)

---

**最后更新**: 2026-08-18
