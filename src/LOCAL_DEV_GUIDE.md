# MetalBoxPack 本地开发指南

## 1. 环境准备

在开始之前，您需要确保您的计算机上安装了以下软件：

### 1.1 安装 Node.js

项目推荐使用 Node.js 20 版本或更高版本。您可以通过以下方式安装：

**Windows 和 macOS 用户:**
- 访问 [Node.js 官网](https://nodejs.org/)
- 下载并安装 LTS (Long Term Support) 版本

**Linux 用户:**
```bash
# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应显示 v20.x.x
npm -v   # 应显示 9.x.x 或更高版本
```

### 1.2 安装 pnpm

这个项目使用 pnpm 作为包管理器，您可以使用以下命令全局安装它：

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm -v  # 应显示 8.x.x 或更高版本
```

### 1.3 安装 Git

如果您需要从版本控制系统克隆项目，您需要安装 Git：

**Windows 用户:**
- 访问 [Git 官网](https://git-scm.com/download/win) 下载并安装

**macOS 用户:**
```bash
# 使用 Homebrew 安装
brew install git
```

**Linux 用户:**
```bash
sudo apt install git -y

# 验证安装
git --version  # 应显示 2.x.x 或更高版本
```

### 1.4 安装代码编辑器

我们推荐使用以下代码编辑器来开发这个项目：

- [Visual Studio Code](https://code.visualstudio.com/)：免费、轻量级且功能强大，有丰富的插件生态系统

推荐安装的 VS Code 插件：
- ESLint：代码质量检查
- Prettier：代码格式化
- TypeScript Hero：TypeScript 辅助工具
- Tailwind CSS IntelliSense：Tailwind CSS 智能提示
- React Developer Tools：React 组件调试

## 2. 获取项目代码

### 2.1 克隆仓库（如果您有仓库访问权限）

```bash
# 克隆项目代码
git clone <您的项目仓库URL>
cd <项目目录>
```

### 2.2 或直接使用下载的代码

如果您已经下载了项目的压缩文件，请解压到您的工作目录中，然后通过命令行进入该目录。

## 3. 安装依赖

在项目根目录中运行以下命令来安装所有必要的依赖：

```bash
# 安装项目依赖
pnpm install
```

## 4. 本地开发服务器

### 4.1 启动完整开发环境（同时启动前端和后端）

安装完依赖后，您可以同时启动前端开发服务器和后端 API 服务器：

```bash
# 同时启动前端和后端服务
pnpm dev
```

这将：
- 在 `http://localhost:3000` 启动前端开发服务器
- 在 `http://localhost:3001` 启动 Node.js 后端 API 服务器

### 4.2 仅启动前端开发服务器

```bash
# 仅启动前端开发服务器
pnpm dev:client
```

### 4.3 仅启动后端服务

```bash
# 仅启动后端服务
pnpm dev:server
```

## 5. 环境配置

### 5.1 创建环境配置文件

在项目根目录创建 `.env` 文件：

```bash
# 在项目根目录创建.env文件
nano .env
```

添加以下内容：
```
# API基础URL - 本地开发时使用此配置
VITE_API_BASE_URL=http://localhost:3001/api
```

## 6. 数据管理

### 6.1 数据库服务

本项目包含一个完整的 Node.js 后端数据库服务，用于存储和管理产品和博客数据。服务器启动后，您可以通过以下 API 端点访问：

- `http://localhost:3001/api/products` - 产品数据 API
- `http://localhost:3001/api/blogs` - 博客数据 API
- `http://localhost:3001/api/sync/all` - 数据同步 API
- `http://localhost:3001/api/health` - 健康检查 API

### 6.2 数据文件

所有数据将存储在项目根目录的 `data` 文件夹中：
- `data/products.json` - 产品数据
- `data/blogs.json` - 博客文章数据
- `data/version.json` - 数据版本控制

### 6.3 创建数据目录

如果数据目录不存在，系统会自动创建，但您也可以手动创建：

```bash
# 创建数据目录并设置权限
mkdir -p data
chmod -R 775 data
```

### 6.4 本地存储同步

系统使用浏览器的 `localStorage` 进行数据缓存和同步：

```javascript
// 在浏览器控制台中执行以下命令可以清除所有本地存储数据
localStorage.clear();
```

## 7. 构建项目

当您的开发工作完成后，可以构建生产版本的项目：

```bash
# 构建生产版本
pnpm build
```

构建完成后：
- 前端静态文件将生成在 `dist/static` 目录中
- 后端服务文件将保留在 `src/server.js`
- 一个构建标记文件 `dist/build.flag` 将被创建，用于部署验证

## 8. 预览生产构建

构建后，您可以启动服务器来预览生产版本：

```bash
# 启动服务预览生产版本
pnpm start
```

这将启动 Node.js 后端服务，并在访问时提供静态文件。您可以通过 `http://localhost:3001` 访问生产版本。

## 9. 后台管理系统访问

### 9.1 登录信息

要访问网站的管理后台进行测试：

1. 在浏览器中访问 `http://localhost:3000/admin/login`
2. 使用默认的管理员账号登录：
   - 用户名：`admin`
   - 密码：`password123`
3. 登录后，您可以在后台界面直接编辑产品信息和博客文章

### 9.2 数据同步功能

系统提供了强大的数据同步机制：

1. **实时数据库同步**：所有在管理后台的修改会自动保存到 Node.js 后端数据库，并反映在前台页面
2. **数据导出/导入**：在管理后台，可通过"Export Data"按钮导出当前数据，在其他设备上通过"Import Data"按钮导入
3. **版本控制**：数据更新时会自动增加版本号，避免冲突
4. **自动检测更新**：前台页面会定期检查更新，当有新数据时会提示用户刷新
5. **服务器同步**：可以直接从服务器同步最新数据

## 10. 调试技巧

### 10.1 前端调试

使用浏览器的开发工具（通常按 F12 或右键点击"检查"打开）可以帮助您调试：

- **Console**：查看日志输出和错误信息
- **Elements**：检查和修改 DOM 结构
- **Sources**：调试 JavaScript/TypeScript 代码
- **Application**：查看和修改本地存储数据

### 10.2 React 开发工具

安装浏览器扩展 [React Developer Tools](https://react.dev/learn/react-developer-tools) 可以帮助您检查 React 组件树和状态。

### 10.3 后端调试

对于后端服务调试：

1. 在 VS Code 中打开项目
2. 点击左侧的调试图标
3. 点击"创建 launch.json 文件"
4. 选择"Node.js"环境
5. 添加以下配置：
   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Debug Server",
     "program": "${workspaceFolder}/src/server.js",
     "console": "integratedTerminal"
   }
   ```
6. 点击"启动调试"按钮开始调试后端服务

### 10.4 API 调试

使用 curl 或 Postman 工具测试 API 端点：

```bash
# 检查服务器健康状态
curl http://localhost:3001/api/health

# 获取产品列表
curl http://localhost:3001/api/products

# 查看数据版本
curl http://localhost:3001/api/version
```

## 11. 常见问题解决

### 11.1 端口冲突

如果端口 3000 或 3001 已被占用，您可以修改 `package.json` 文件中的脚本，更改端口号：

```json
"scripts": {
  "dev:client": "vite --host --port 3002",
  "dev:server": "PORT=3003 node src/server.js",
  "dev": "concurrently \"pnpm dev:client\" \"PORT=3003 pnpm dev:server\"",
  // ...
}
```

同时修改 `.env` 文件中的 API 基础 URL：
```
VITE_API_BASE_URL=http://localhost:3003/api
```

### 11.2 依赖安装失败

如果依赖安装失败，尝试清除 pnpm 缓存：

```bash
# 清除缓存
pnpm store prune

# 清除node_modules目录
rm -rf node_modules

# 然后重新安装依赖
pnpm install
```

### 11.3 构建错误

如果构建过程中出现错误，检查是否有 TypeScript 编译错误或其他语法问题：

```bash
# 运行 TypeScript 检查
npx tsc --noEmit
```

### 11.4 数据服务连接问题

如果前端无法连接到后端服务：

1. 确保后端服务已启动：`pnpm dev:server`
2. 检查控制台错误信息
3. 验证 API 端点是否可访问：`curl http://localhost:3001/api/version`
4. 检查 `.env` 文件中的 API_BASE_URL 设置是否正确
5. 确认防火墙没有阻止端口访问

### 11.5 文件权限问题

如果数据文件无法写入：

```bash
# 确保数据目录可写
mkdir -p data
chmod -R 775 data
```

### 11.6 数据同步问题

如果数据同步功能不正常：

```bash
# 检查后端服务是否正在运行
pm2 status

# 查看后端服务日志
pm2 logs tinshine-backend

# 清除浏览器本地存储数据
# 在浏览器控制台执行
localStorage.clear();
```

### 11.7 域名配置

在生产环境中，网站已设置为使用域名 `https://www.metalboxpack.com`。本地开发时，您可以通过 `http://localhost:3000` 访问项目。

### 11.8 自动刷新问题

如果开发服务器没有自动刷新页面：

```bash
# 确保您的编辑器没有锁定文件
# 尝试手动刷新浏览器页面 (Ctrl+F5)
# 如果问题持续存在，重新启动开发服务器
pnpm dev
```

### 11.9 跨域问题

如果遇到跨域错误：

```bash
# 检查后端服务是否正确配置了 CORS
# 在 server.js 文件中确保已添加了 cors 中间件
# const cors = require('cors');
# app.use(cors());
```

### 11.10 性能优化调试

对于页面性能问题：

1. 使用浏览器的 Performance 面板记录页面加载过程
2. 检查大型组件的渲染性能
3. 优化图片加载和资源请求

## 12. 开发工作流

### 12.1 功能开发流程

1. 创建新分支：`git checkout -b feature/my-new-feature`
2. 开发功能
3. 运行 TypeScript 检查：`npx tsc --noEmit`
4. 构建项目：`pnpm build`
5. 提交更改：`git commit -m "Add new feature"`
6. 推送到远程仓库：`git push origin feature/my-new-feature`
7. 创建合并请求

### 12.2 代码风格指南

- 使用 TypeScript 进行类型安全开发
- 遵循 React 最佳实践
- 使用 Tailwind CSS 进行样式设计
- 组件拆分要合理，每个组件职责单一
- 确保代码可读性，添加适当的注释
- 遵循命名约定，使用有意义的变量和函数名

### 12.3 协作开发

- 定期从主分支拉取最新代码：`git pull origin main`
- 解决合并冲突
- 提交小型、频繁的更改
- 遵循团队的分支策略和代码审查流程

### 11.6 域名配置
  
在生产环境中，网站已设置为使用域名 `https://www.metalboxpack.com`。本地开发时，您可以通过 `http://localhost:3000` 访问项目。

按照以上步骤，您应该能够成功在本地环境中部署和测试这个项目。如果您遇到任何问题，请参考错误信息进行排查，或咨询项目的开发团队获取帮助。