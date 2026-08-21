#!/bin/bash

# ============================================
# Foodshop Node Docker 环境初始化脚本
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函数
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装 $1"
        return 1
    fi
    return 0
}

# 生成随机密码
generate_password() {
    local length=${1:-16}
    LC_ALL=C tr -dc 'A-Za-z0-9!@#$%^&*' < /dev/urandom | head -c ${length}
}

# 检查 Docker 环境
check_docker() {
    print_step "检查 Docker 环境..."
    
    if ! check_command docker; then
        print_error "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
        exit 1
    fi
    
    # 检查 Docker Compose（支持插件版本和独立版本）
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    elif check_command docker-compose; then
        COMPOSE_CMD="docker-compose"
    else
        print_error "Docker Compose 未安装"
        print_error "请访问 https://docs.docker.com/compose/install/ 安装 Docker Compose"
        exit 1
    fi
    
    print_info "Docker 和 Docker Compose 已安装"
    docker --version
    $COMPOSE_CMD version
}

# 初始化环境配置文件
init_env_files() {
    print_step "初始化环境配置文件..."
    
    # 检查 .env 文件
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_info "已从 .env.example 创建 .env 文件"
            print_warn "请编辑 .env 文件，配置数据库密码等敏感信息"
            print_warn "配置完成后重新运行此脚本"
            exit 0
        else
            print_error ".env.example 文件不存在"
            exit 1
        fi
    else
        print_info ".env 文件已存在"
    fi
    
    # 检查 MongoDB 密码是否已配置
    if grep -q "your_secure_password_here" .env; then
        print_error "检测到 .env 中 MongoDB 密码未配置（仍为默认值）"
        print_error "请编辑 .env 文件，修改 MONGO_INITDB_ROOT_PASSWORD 和 MONGO_URL"
        exit 1
    fi
    
    print_info "环境配置检查通过"
}

# 创建必要的目录
create_directories() {
    print_step "创建必要的目录..."
    
    mkdir -p logs/web logs/app logs/db logs/pm2 logs/nginx
    
    print_info "日志目录已创建"
}

# 检查配置文件
check_configs() {
    print_step "检查配置文件..."
    
    # 检查 .gitignore 是否包含敏感文件
    if ! grep -q "^\.env$" .gitignore; then
        print_warn ".gitignore 未包含 .env，正在添加..."
        echo "" >> .gitignore
        echo "# 敏感信息文件（包含密码等）" >> .gitignore
        echo ".env" >> .gitignore
        echo "secrets/" >> .gitignore
        print_info "已更新 .gitignore"
    else
        print_info ".gitignore 配置正确"
    fi
    
    # 检查 Nginx 配置
    if [ ! -f nginx/default.d/node.conf ]; then
        print_error "nginx/default.d/node.conf 文件不存在"
        exit 1
    fi
    
    print_info "配置文件检查完成"
}

# 显示配置信息
show_config_info() {
    echo ""
    echo "========================================"
    echo "  环境初始化完成"
    echo "========================================"
    echo ""
    echo "配置文件："
    echo "  - .env (环境配置，已加入 .gitignore)"
    echo ""
    echo "下一步操作："
    echo "  1. 查看并确认 .env 中的密码配置"
    echo "  2. 运行 ./deploy.sh start 启动服务"
    echo ""
    echo "服务访问地址（启动后）："
    echo "  - Web 应用: http://localhost:80"
    echo "  - Node.js: http://localhost:3000"
    echo "  - RabbitMQ 管理: http://localhost:15672"
    echo ""
    echo "========================================"
    echo ""
}

# 主函数
main() {
    echo ""
    echo "========================================"
    echo "  Foodshop Node Docker 环境初始化"
    echo "========================================"
    echo ""
    
    check_docker
    init_env_files
    create_directories
    check_configs
    show_config_info
}

# 执行主函数
main
