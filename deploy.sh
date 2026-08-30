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

# 设置平台参数
# 用法: set_platform <amd64|arm64>
set_platform() {
    local platform_input=${1:-amd64}

    case "$platform_input" in
        amd64|x86_64|x64)
            export PLATFORM="linux/amd64"
            export PLATFORM_TAG="amd64"
            ;;
        arm64|aarch64|arm)
            export PLATFORM="linux/arm64"
            export PLATFORM_TAG="arm64"
            ;;
        *)
            print_error "不支持的平台: $platform_input"
            print_error "支持的平台: amd64, arm64"
            exit 1
            ;;
    esac

    print_info "目标平台: $PLATFORM (镜像标签: $PLATFORM_TAG)"
}

# 构建镜像
# 用法: build_images [amd64|arm64]
build_images() {
    local target_platform=${1:-amd64}

    set_platform "$target_platform"

    print_info "开始构建 Docker 镜像..."
    $COMPOSE_CMD build --no-cache
    if [ $? -eq 0 ]; then
        print_info "镜像构建成功"
        print_info "镜像列表:"
        echo "  - ${DOCKER_USER:-zoroers}/foodshop-${PLATFORM_TAG}"
        echo "  - ${DOCKER_USER:-zoroers}/foodshop-h5-${PLATFORM_TAG}"
        echo "  - ${DOCKER_USER:-zoroers}/foodshop-admin-${PLATFORM_TAG}"
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
    echo "2. 构建镜像（选择平台）"
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
# 交互式选择平台
prompt_platform() {
    echo "" >&2
    echo "请选择目标平台：" >&2
    echo "  1) amd64 (x86_64)" >&2
    echo "  2) arm64 (aarch64 / Apple Silicon)" >&2
    read -p "请选择 [1-2，默认 1]: " platform_choice
    case "${platform_choice:-1}" in
        1|amd64|x86_64) echo "amd64" ;;
        2|arm64|aarch64|arm) echo "arm64" ;;
        *) print_error "无效选择，使用默认 amd64" >&2; echo "amd64" ;;
    esac
}

main() {
    check_docker
    check_env
    create_directories

    while true; do
        show_menu
        read -p "请选择操作 [0-8]: " choice

        case $choice in
            1)
                platform=$(prompt_platform)
                build_images "$platform"
                start_services
                wait_for_services
                ;;
            2)
                platform=$(prompt_platform)
                build_images "$platform"
                ;;
            3)
                platform=$(prompt_platform)
                set_platform "$platform"
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
# 用法：
#   ./deploy.sh start [amd64|arm64]   完整部署
#   ./deploy.sh build [amd64|arm64]   仅构建镜像
#   ./deploy.sh stop                  停止服务
#   ./deploy.sh restart               重启服务
#   ./deploy.sh logs                  查看日志
#   ./deploy.sh status                查看状态
case "$1" in
    start)
        check_docker
        check_env
        create_directories
        platform=${2:-amd64}
        build_images "$platform"
        start_services
        wait_for_services
        ;;
    build)
        check_docker
        check_env
        create_directories
        platform=${2:-amd64}
        build_images "$platform"
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        view_logs
        ;;
    status)
        $COMPOSE_CMD ps
        ;;
    "")
        main
        ;;
    *)
        print_error "未知命令: $1"
        echo "可用命令: start|build [amd64|arm64], stop, restart, logs, status"
        exit 1
        ;;
esac
