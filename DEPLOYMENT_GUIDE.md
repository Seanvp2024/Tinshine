# 将React网站部署到Ubuntu服务器指南
本指南将帮助您在Ubuntu服务器上部署此React + TypeScript + Tailwind CSS网站，包括完整的Node.js后端服务。

## 1. 服务器准备工作

### 1.1 更新系统包
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 安装Node.js
```bash
# 安装Node.js 20（推荐版本）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

### 1.3 安装pnpm（项目使用的包管理器）
```bash
npm install -g pnpm
```

### 1.4 安装Git
```bash
sudo apt install git -y
```

### 1.5 安装PM2进程管理器（用于管理Node.js应用）
```bash
npm install -g pm2
```

## 2. 克隆项目代码
```bash
# 克隆您的项目代码
git clone <您的项目仓库URL>
cd <项目目录>
```

## 3. 构建项目
```bash
# 安装依赖
pnpm install

# 构建项目（使用package.json中定义的build脚本）
pnpm run build
```

构建完成后，项目将生成在`dist`目录中。

## 4. 安装和配置Nginx
### 4.1 安装Nginx
```bash
sudo apt install nginx -y

# 启动Nginx并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4.2 配置Nginx服务器块
```bash
# 创建网站配置文件
sudo nano /etc/nginx/sites-available/metalboxpack.com
```

在编辑器中添加以下内容（替换`your-domain.com`为您的域名）：
```nginx
server {
    listen 80;
    server_name metalboxpack.com www.metalboxpack.com;
    
    # 静态文件服务
    root /path/to/your/project/dist/static;
    index index.html;
    
    # API请求转发到Node.js服务器
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 前端路由处理
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态文件缓存设置
    location ~* \.(js|css|jpg|jpeg|png|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
    
    # 错误页面
    error_page 404 /index.html;
    
    # 日志设置
    access_log /var/log/nginx/metalboxpack.com.access.log;
    error_log /var/log/nginx/metalboxpack.com.error.log;
}
```

保存并退出编辑器（按`Ctrl+O`保存，`Ctrl+X`退出）。

### 4.3 启用配置并重启Nginx
```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/metalboxpack.com /etc/nginx/sites-enabled/

# 测试Nginx配置
sudo nginx -t

# 重启Nginx服务
sudo systemctl restart nginx
```

## 5. 配置防火墙
```bash
# 允许HTTP和HTTPS流量
sudo ufw allow 'Nginx Full'

# 允许Node.js服务器端口
sudo ufw allow 3001/tcp

# 验证更改
sudo ufw status
```

## 6. 设置SSL证书（可选但推荐）
使用Certbot获取免费的Let's Encrypt SSL证书：
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d metalboxpack.com -d www.metalboxpack.com

# 验证证书自动续期
sudo systemctl status certbot.timer
```

## 7. 启动Node.js后端服务
```bash
# 使用PM2启动Node.js服务器
pm2 start src/server.js --name tinshine-backend

# 设置PM2开机自启
pm2 startup systemd
pm2 save
```

## 8. 自动化部署（可选）
您可以创建一个简单的部署脚本`deploy.sh`来简化部署过程：
```bash
#!/bin/bash
echo "开始部署..."

# 拉取最新代码
git pull origin main

# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 重启Node.js服务器
pm2 restart tinshine-backend

# 重启Nginx
sudo systemctl restart nginx

echo "部署完成！"
```

为脚本添加执行权限：
```bash
chmod +x deploy.sh
```

之后只需运行`./deploy.sh`即可完成部署。

## 9. 数据目录设置
确保数据目录可写：
```bash
mkdir -p data
chmod -R 775 data
```

## 10. 监控和维护
- 定期更新系统包：`sudo apt update && sudo apt upgrade -y`
- 监控网站状态：`sudo systemctl status nginx`
- 监控Node.js服务状态：`pm2 status`
- 查看Node.js日志：`pm2 logs tinshine-backend`
- 查看访问日志：`sudo tail -f /var/log/nginx/your-domain.com.access.log`

## 11. 后台管理系统访问说明
 - 网站后台登录地址：`https://metalboxpack.com/admin/login`
- 默认管理员账号：`admin`
- 默认管理员密码：`password123`
- 建议登录后修改默认密码以提高安全性

## 12. 常见问题排查
- **Nginx错误**：检查错误日志 `sudo tail -f /var/log/nginx/error.log`
 - **权限问题**：确保Nginx用户可以访问您的项目目录 `sudo chown -R www-data:www-data /path/to/your/project/dist`
 - **域名DNS设置**：确保您已将 `metalboxpack.com` 和 `www.metalboxpack.com` 域名解析到您的服务器IP地址
- **端口占用**：检查80/443/3001端口是否被占用 `sudo lsof -i :80` `sudo lsof -i :3001`
- **Node.js服务问题**：查看PM2日志 `pm2 logs tinshine-backend`
- **数据写入问题**：确保data目录有正确的写入权限 `chmod -R 775 data`