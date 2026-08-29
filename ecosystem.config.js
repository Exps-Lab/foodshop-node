module.exports = {
  apps: [{
    name: 'foodshop-node',
    script: './index.js',
    instances: 'max',
    // 集群模式，开启多个进程
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // 日志配置
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/pm2/error.log',
    out_file: './logs/pm2/out.log',
    merge_logs: true,
    // 重启策略
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }],
  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
