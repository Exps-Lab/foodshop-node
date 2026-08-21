#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    # 检查 Docker Compose（支持插件版本和独立版本）
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    elif command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi

    print_info "Docker 和 Docker Compose 已安装"
}

# 检查环境配置文件
check_env() {
    # 检查 .env 文件
    if [ ! -f .env ]; then
        print_warn ".env 文件不存在，从 .env.example 复制..."
        cp .env.example .env
        print_info "已创建 .env 文件"
        print_warn "请编辑 .env 文件，配置数据库密码等敏感信息"
        print_warn "配置完成后重新运行此脚本"
        exit 0
    fi
    
    # 检查是否包含默认密码
    if grep -q "your_secure_password_here" .env; then
        print_error "检测到 .env 中仍使用默认密码"
        print_error "请编辑 .env 文件，修改所有密码为实际值"
        exit 1
    fi
}

# 创建必要的目录
create_directories() {
    print_info "创建必要的目录..."
    mkdir -p logs/web logs/app logs/db logs/pm2 logs/nginx
}

# 构建镜像
build_images() {
    print_info "开始构建 Docker 镜像..."
    $COMPOSE_CMD build --no-cache
    if [ $? -eq 0 ]; then
        print_info "镜像构建成功"
    else
        print_error "镜像构建失败"
        exit 1
    fi
}

# 启动服务
start_services() {
    print_info "启动所有服务..."
    $COMPOSE_CMD up -d
    
    if [ $? -eq 0 ]; then
        print_info "服务启动成功"
    else
        print_error "服务启动失败"
        exit 1
    fi
}

# 等待服务就绪
wait_for_services() {
    print_info "等待服务就绪..."
    sleep 10
    
    # 检查服务状态
    $COMPOSE_CMD ps

    print_info "服务启动完成，访问地址："
    echo "  - Nginx: http://localhost:${NGINX_PORT:-80}"
    echo "  - Node.js: http://localhost:${PORT:-3000}"
    echo "  - RabbitMQ Management: http://localhost:${RABBITMQ_MANAGEMENT_PORT:-15672}"
    echo "  - MongoDB: localhost:${MONGO_PORT:-28017}"
    echo "  - Redis: localhost:${REDIS_PORT:-6379}"
}

# 查看日志
view_logs() {
    print_info "查看服务日志..."
    $COMPOSE_CMD logs -f
}

# 停止服务
stop_services() {
    print_info "停止所有服务..."
    $COMPOSE_CMD down
    print_info "服务已停止"
}

# 重启服务
restart_services() {
    print_info "重启所有服务..."
    $COMPOSE_CMD restart
    print_info "服务已重启"
}

# 清理数据
clean_data() {
    print_warn "此操作将删除所有数据卷，是否继续？(y/n)"
    read confirm
    if [ "$confirm" = "y" ]; then
        print_info "停止并删除所有容器和数据卷..."
        $COMPOSE_CMD down -v
        print_info "数据已清理"
    else
        print_info "操作已取消"
    fi
}

# 主菜单
show_menu() {
    echo ""
    echo "================================"
    echo "  Foodshop Node Docker 部署工具  "
    echo "================================"
    echo "1. 完整部署（构建 + 启动）"
    echo "2. 仅构建镜像"
    echo "3. 仅启动服务"
    echo "4. 查看服务状态"
    echo "5. 查看服务日志"
    echo "6. 重启服务"
    echo "7. 停止服务"
    echo "8. 清理数据（危险操作）"
    echo "0. 退出"
    echo "================================"
    echo ""
}

# 主程序
main() {
    check_docker
    check_env
    create_directories
    
    while true; do
        show_menu
        read -p "请选择操作 [0-8]: " choice
        
        case $choice in
            1)
                build_images
                start_services
                wait_for_services
                ;;
            2)
                build_images
                ;;
            3)
                start_services
                wait_for_services
                ;;
            4)
                $COMPOSE_CMD ps
                ;;
            5)
                view_logs
                ;;
            6)
                restart_services
                ;;
            7)
                stop_services
                ;;
            8)
                clean_data
                ;;
            0)
                print_info "退出部署工具"
                exit 0
                ;;
            *)
                print_error "无效选择，请重新输入"
                ;;
        esac
        
        echo ""
        read -p "按回车键继续..."
    done
}

# 支持命令行参数
if [ "$1" = "start" ]; then
    check_docker
    check_env
    create_directories
    build_images
    start_services
    wait_for_services
elif [ "$1" = "stop" ]; then
    stop_services
elif [ "$1" = "restart" ]; then
    restart_services
elif [ "$1" = "logs" ]; then
    view_logs
elif [ "$1" = "status" ]; then
    $COMPOSE_CMD ps
else
    main
fi
