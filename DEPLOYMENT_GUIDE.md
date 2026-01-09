# MetalBoxPack 网站部署指南

## 1. 系统要求

### 1.1 服务器需求
- Ubuntu 20.04 LTS 或更高版本
- 至少 2GB RAM
- 至少 2 CPU 核心
- 至少 10GB 可用磁盘空间
- 已配置的域名 (metalboxpack.com)

### 1.2 网络要求
- 开放的 HTTP (80) 和 HTTPS (443) 端口
- Node.js API 端口 (3001)
- 可选：SSH 访问端口 (22)

## 2. 服务器准备工作

### 2.1 更新系统包
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 安装必要的系统工具
```bash
sudo apt install -y curl wget git unzip vim
```

### 2.3 安装Node.js
```bash
# 安装Node.js 20（推荐版本）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应显示 v20.x.x
npm -v   # 应显示 9.x.x 或更高版本
```

### 2.4 安装pnpm（项目使用的包管理器）
```bash
npm install -g pnpm
pnpm --version  # 验证安装
```

### 2.5 安装PM2进程管理器
```bash
npm install -g pm2
pm2 --version  # 验证安装
```

## 3. 克隆项目代码

```bash
# 克隆项目代码
git clone <您的项目仓库URL>
cd <项目目录>
```

## 4. 环境配置

### 4.1 创建环境配置文件
在项目根目录创建 `.env` 文件：
```bash
nano .env
```

添加以下内容（根据您的实际环境修改）：
```
# API基础URL - 在生产环境中使用您的实际域名
VITE_API_BASE_URL=https://www.metalboxpack.com/api

# Node.js服务器端口（可选，默认为3001）
# PORT=3001
```

### 4.2 创建数据目录
```bash
mkdir -p data
chmod -R 775 data
```

## 5. 构建项目

```bash
# 安装依赖
pnpm install

# 构建项目（使用package.json中定义的build脚本）
pnpm run build
```

构建完成后，项目静态文件将生成在 `dist/static` 目录中。

## 6. 安装和配置Nginx

### 6.1 安装Nginx
```bash
sudo apt install nginx -y

# 启动Nginx并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 6.2 配置Nginx服务器块
```bash
# 创建网站配置文件
sudo nano /etc/nginx/sites-available/metalboxpack.com
```

添加以下配置（请替换`/path/to/your/project`为您的项目实际路径）：
```nginx
server {
    listen 80;
    server_name metalboxpack.com www.metalboxpack.com;
    
    # 静态文件服务 - 确保路径正确指向dist/static目录
    root /path/to/your/project/dist/static;
    index index.html;
    
    # API请求转发到Node.js服务器
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 增加超时设置
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }
    
    # 前端路由处理
    location / {
        try_files $uri $uri/ /index.html;
        
        # 安全头部设置
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
    }
    
    # 静态文件缓存设置
    location ~* \.(js|css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        add_header Vary "Accept-Encoding";
    }
    
    # 错误页面
    error_page 404 /index.html;
    
    # 禁止直接访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 日志设置
    access_log /var/log/nginx/metalboxpack.com.access.log;
    error_log /var/log/nginx/metalboxpack.com.error.log;
}
```

保存并退出编辑器（按`Ctrl+O`保存，`Ctrl+X`退出）。

### 6.3 启用配置并重启Nginx
```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/metalboxpack.com /etc/nginx/sites-enabled/

# 移除默认配置（如果存在）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
sudo nginx -t

# 如果测试通过，重启Nginx服务
sudo systemctl restart nginx
```

## 7. 配置防火墙

```bash
# 查看当前防火墙状态
sudo ufw status

# 如果防火墙未启用，启用它
sudo ufw enable

# 允许SSH访问（如果需要）
sudo ufw allow 22/tcp

# 允许HTTP和HTTPS流量
sudo ufw allow 'Nginx Full'

# 允许Node.js服务器端口
sudo ufw allow 3001/tcp

# 验证更改
sudo ufw status
```

## 8. 设置SSL证书（推荐）

使用Certbot获取免费的Let's Encrypt SSL证书：
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d metalboxpack.com -d www.metalboxpack.com

# 验证证书自动续期
sudo systemctl status certbot.timer
```

Certbot会自动更新您的Nginx配置以支持HTTPS。

## 9. 启动Node.js后端服务

```bash
# 确保您在项目根目录下
cd /path/to/your/project

# 使用PM2启动Node.js服务器
pm2 start src/server.js --name metalboxpack-backend

# 设置PM2开机自启
pm2 startup systemd
pm2 save
```

## 10. 部署验证

### 10.1 创建验证脚本
在项目根目录创建 `verify_deployment.sh` 文件：
```bash
#!/bin/bash
echo "=== MetalBoxPack 部署验证 ==="

# 检查Nginx服务状态
echo -e "\n1. Nginx 服务状态:"
sudo systemctl status nginx --no-pager | grep "Active:"

# 检查Node.js服务状态
echo -e "\n2. Node.js 服务状态:"
pm2 list | grep metalboxpack-backend

# 检查数据目录权限
echo -e "\n3. 数据目录权限:"
ls -ld data

# 检查API连接
echo -e "\n4. API连接测试:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/version
echo " - API版本检查"

curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/products
echo " - 产品API检查"

# 检查网站可访问性
echo -e "\n5. 网站可访问性测试:"
curl -s -o /dev/null -w "%{http_code}" https://www.metalboxpack.com
echo " - 网站主页检查"

curl -s -o /dev/null -w "%{http_code}" https://www.metalboxpack.com/products
echo " - 产品页面检查"

# 检查SSL证书状态
echo -e "\n6. SSL证书信息:"
openssl s_client -connect metalboxpack.com:443 -servername metalboxpack.com </dev/null 2>/dev/null | openssl x509 -noout -dates

echo -e "\n=== 验证完成 ==="
```

### 10.2 运行验证脚本
```bash
chmod +x verify_deployment.sh
./verify_deployment.sh
```

## 11. 自动化部署（推荐）

### 11.1 创建部署脚本
在项目根目录创建 `deploy.sh` 文件：
```bash
#!/bin/bash
set -e  # 遇到错误时退出

# 配置
PROJECT_DIR="/path/to/your/project"
BRANCH="main"
ENV_FILE="$PROJECT_DIR/.env"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # 无颜色

echo -e "${GREEN}=== MetalBoxPack 部署开始 ===${NC}"

# 进入项目目录
cd "$PROJECT_DIR"

# 拉取最新代码
echo -e "${YELLOW}1. 拉取最新代码...${NC}"
git pull origin "$BRANCH"

# 安装依赖
echo -e "${YELLOW}2. 安装依赖...${NC}"
pnpm install

# 构建项目
echo -e "${YELLOW}3. 构建项目...${NC}"
pnpm run build

# 验证构建是否成功
if [ ! -d "dist/static" ]; then
  echo -e "${RED}构建失败：dist/static 目录不存在${NC}"
  exit 1
fi

# 重启Node.js服务器
echo -e "${YELLOW}4. 重启Node.js服务器...${NC}"
pm2 restart metalboxpack-backend

# 重启Nginx
echo -e "${YELLOW}5. 重启Nginx...${NC}"
sudo systemctl restart nginx

# 运行部署验证
echo -e "${YELLOW}6. 运行部署验证...${NC}"
./verify_deployment.sh

echo -e "${GREEN}=== MetalBoxPack 部署完成！===${NC}"
```

### 11.2 设置部署脚本权限
```bash
chmod +x deploy.sh
```

之后只需运行 `./deploy.sh` 即可完成一键部署。

## 12. 监控和维护

### 12.1 系统监控
- 定期更新系统包：`sudo apt update && sudo apt upgrade -y`
- 监控系统资源：`htop`
- 查看磁盘使用：`df -h`

### 12.2 服务监控
- 监控网站状态：`sudo systemctl status nginx`
- 监控Node.js服务状态：`pm2 status`
- 查看Node.js日志：`pm2 logs metalboxpack-backend`
- 查看访问日志：`sudo tail -f /var/log/nginx/metalboxpack.com.access.log`
- 查看错误日志：`sudo tail -f /var/log/nginx/metalboxpack.com.error.log`

### 12.3 定期维护任务
创建一个每周维护的cron任务：
```bash
sudo crontab -e
```

添加以下内容：
```
# 每周日凌晨2点运行系统更新和日志清理
0 2 * * 0 /path/to/your/project/maintenance.sh
```

创建 `maintenance.sh` 文件：
```bash
#!/bin/bash
# 系统更新
apt update && apt upgrade -y

# 清理PM2日志
pm2 flush

# 清理Nginx日志
find /var/log/nginx -type f -name "*.log" -exec truncate -s 0 {} \;

# 清理系统临时文件
rm -rf /tmp/*
```

设置执行权限：`chmod +x maintenance.sh`

## 13. 后台管理系统访问说明

- 网站后台登录地址：`https://metalboxpack.com/admin/login`
- 默认管理员账号：`admin`
- 默认管理员密码：`password123`
- 首次登录后请立即修改密码：
  1. 登录管理后台
  2. 进入用户设置
  3. 修改密码并保存

## 14. 常见问题排查

### 14.1 API请求失败问题

如果您看到类似"Fetch request failed"或"Error in API request to /version"的错误：

1. 确认Node.js服务正在运行：`pm2 status metalboxpack-backend`
2. 检查API端口是否可访问：`curl http://localhost:3001/api/products`
3. 验证Nginx配置是否正确转发API请求：
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. 检查防火墙设置：`sudo ufw status`确保3001端口已开放
5. 验证.env文件中的API_BASE_URL设置是否正确
6. 检查前端构建是否包含最新的环境变量：`grep -r "VITE_API_BASE_URL" dist/`

### 14.2 权限问题

确保各目录有正确的权限：
```bash
# 确保项目目录权限正确
sudo chown -R $USER:$USER /path/to/your/project

# 确保Nginx可以访问静态文件
sudo chown -R www-data:www-data /path/to/your/project/dist/static

# 确保数据目录可写
chmod -R 775 data

# 确保Node.js可以读取项目文件
sudo chmod -R 755 /path/to/your/project
```

### 14.3 域名配置问题
- 确保您已将 `metalboxpack.com` 和 `www.metalboxpack.com` 域名解析到您的服务器IP地址
- 验证DNS设置是否生效：`nslookup metalboxpack.com` 和 `nslookup www.metalboxpack.com`
- 检查域名解析是否全局生效：`dig metalboxpack.com +trace`

### 14.4 端口占用问题

检查端口是否被占用：
```bash
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :3001
```

如果端口被占用，可以杀死占用进程：
```bash
sudo kill -9 $(sudo lsof -t -i :3001)
```

或修改配置使用其他端口：
1. 修改 `server.js` 中的端口设置
2. 更新 Nginx 配置中的代理设置
3. 重启相关服务

### 14.5 服务启动失败

如果Node.js服务无法启动，查看详细日志：
```bash
pm2 logs metalboxpack-backend --lines 200

# 或直接查看错误日志
cat ~/.pm2/logs/metalboxpack-backend-error.log
```

### 14.6 构建问题

如果前端构建失败：
```bash
# 清除缓存后重新构建
pnpm cache clean
rm -rf node_modules
pnpm install
pnpm run build
```

### 14.7 数据持久化问题

如果数据没有正确保存：
```bash
# 检查数据目录权限
ls -ld data
ls -l data/

# 验证JSON文件格式
for file in data/*.json; do
  echo "Checking $file..."
  jq . "$file" > /dev/null
  if [ $? -ne 0 ]; then
    echo "Error in $file"
  fi
done
```

## 15. 备份策略

### 15.1 数据备份
创建数据备份脚本 `backup_data.sh`：
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 备份数据目录
tar -czvf "$BACKUP_DIR/metalboxpack_data_$TIMESTAMP.tar.gz" ./data

# 保留最近30天的备份
find "$BACKUP_DIR" -name "metalboxpack_data_*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/metalboxpack_data_$TIMESTAMP.tar.gz"
```

设置定期备份任务：
```bash
# 每天凌晨3点备份数据
0 3 * * * /path/to/your/project/backup_data.sh
```

### 15.2 恢复备份
```bash
# 解压备份文件
tar -xzvf /path/to/backups/metalboxpack_data_YYYYMMDD_HHMMSS.tar.gz

# 重启服务以应用恢复的数据
pm2 restart metalboxpack-backend
```

## 16. 扩展和优化建议

### 16.1 性能优化
- 配置Nginx缓存：
  ```nginx
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;
  ```
- 添加CDN加速静态资源
- 优化Node.js内存使用：`pm2 start src/server.js --name metalboxpack-backend --max-memory-restart 250M`

### 16.2 安全增强
- 配置Fail2Ban防止暴力破解：`sudo apt install fail2ban`
- 定期更新密码和访问密钥
- 限制SSH访问仅允许特定IP

### 16.3 负载均衡
如果需要处理高流量，可以配置Nginx负载均衡：
```nginx
upstream api_servers {
    server localhost:3001;
    server localhost:3002;
    # 可以添加更多Node.js实例
}

server {
    # ...
    location /api {
        proxy_pass http://api_servers;
        # 其他代理设置...
    }
    # ...
}
```