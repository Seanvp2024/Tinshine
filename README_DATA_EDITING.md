# 网站数据修改指南
 
本指南将帮助您了解如何修改下载的网站文件中的数据。需要注意的是，这个项目是一个**完整的前后端应用**，使用Node.js作为后端服务器和JSON文件作为数据存储，让您可以轻松地修改网站内容并在所有设备上同步更新。

## 数据存储方式

1. **Node.js后端服务**：项目使用Node.js服务器 (`src/server.js`) 提供完整的API接口，管理产品和博客数据
2. **JSON数据文件**：所有数据存储在项目根目录的 `data` 文件夹中，包括 `products.json` 和 `blogs.json`
3. **浏览器本地缓存**：前端页面会缓存数据以提高性能，但会定期检查服务器更新

## 修改产品数据

### 方法一：通过后台管理界面修改（推荐）

1. 在浏览器中打开网站
2. 访问管理后台：`https://your-domain.com/admin/login`
3. 使用管理员账号登录（默认：用户名 `admin`，密码 `password123`）
4. 在后台界面中，您可以直接添加、编辑或删除产品数据和博客文章
5. 所有更改会自动保存到服务器的JSON文件中，并在所有设备上同步显示

### 方法二：通过代码修改静态数据

如果您需要批量修改数据或进行高级定制，可以通过以下方式：

1. 使用代码编辑器打开 `src/lib/productData.ts` 文件

2. 这个文件包含以下主要部分：
   - 产品类型定义 (`Product` interface)
   - 产品类别类型定义 (`ProductCategory` interface)
   - 产品数据生成函数 (`generateProducts`)
   - 各产品类别的数据集合
   - 产品类别数据 (`productCategories`)
   - 数据查询辅助函数

3. **修改现有产品数据**：
   - 找到对应的产品数据数组（如 `foodIronBoxProducts`、`wineCansProducts` 等）
   - 直接修改数组中的产品对象属性

4. **添加新产品**：
   ```typescript
   // 方法1：直接向数据数组添加新对象
   foodIronBoxProducts.push({
     id: 243, // 使用一个新的唯一ID
     name: "Custom Food Box",
     description: "Your custom description here",
     // 填写其他必要的产品属性
     // ...
   });

   // 方法2：修改generateProducts函数生成更多产品
   export const foodIronBoxProducts = generateProducts('Food Iron Box', 250); // 增加数量从242到250
   ```

5. **修改产品类别数据**：
   - 找到 `productCategories` 数组
   - 修改对应的类别对象属性

### 方法三：直接编辑JSON文件

对于高级用户，您也可以直接编辑服务器上的JSON数据文件：

1. 导航到项目根目录的 `data` 文件夹
2. 编辑 `products.json` 或 `blogs.json` 文件
3. 保存更改后，重新启动服务器使更改生效

## 数据同步机制

### 跨设备数据同步

系统提供了强大的数据同步机制：

1. **实时数据库同步**：所有在管理后台的修改会自动保存到Node.js后端数据库，并反映在前台页面
2. **数据导出/导入**：在管理后台，可通过"Export Data"按钮导出当前数据，在其他设备上通过"Import Data"按钮导入
3. **版本控制**：数据更新时会自动增加版本号，避免冲突
4. **自动检测更新**：前台页面会定期检查更新，当有新数据时会提示用户刷新

### 手动同步数据

如果您希望强制同步最新数据：

1. 在前台页面，点击右下角的"Update"按钮（当有新数据可用时显示）
2. 在管理后台，使用"Import Data"和"Export Data"按钮进行手动同步

## 数据结构说明

### 产品数据结构 (Product interface)
```typescript
interface Product {
  id: number;          // 产品唯一ID
  name: string;        // 产品名称
  description: string; // 产品描述
  shortDescription: string; // 产品简短描述
  imageUrl: string;   // 产品图片URL
  additionalImages: string[]; // 额外图片URL数组
  rating: number;      // 产品评分
  category: string;    // 产品类别
  subCategory?: string; // 子类别（可选）
  dimensions?: {       // 尺寸信息（可选）
    height: number;
    width: number;
    depth: number;
    unit: string;
  };
  material?: string;   // 材料（可选）
  capacity?: string;   // 容量（可选）
  color?: string;      // 颜色（可选）
  features?: string[]; // 特性列表（可选）
  applications?: string[]; // 应用场景（可选）
  minOrderQuantity?: number; // 最小起订量（可选）
  isNew?: boolean;     // 是否新品（可选）
  isFeatured?: boolean; // 是否精选（可选）
  createdAt: string;   // 创建日期
}
```

### 产品类别数据结构 (ProductCategory interface)
```typescript
interface ProductCategory {
  id: number;          // 类别唯一ID
  name: string;        // 类别名称
  icon: string;        // 类别图标（FontAwesome图标类名）
  imageUrl: string;    // 类别图片URL
  description: string; // 类别描述
  count: number;       // 该类别下产品数量
}
```

## 更改图片

当前网站提供了多种方式更换图片：

### 方法一：通过后台管理界面（推荐）

1. 登录管理后台
2. 选择要编辑的产品或博客文章
3. 在编辑界面中，直接输入新的图片URL
4. 保存更改后，图片会立即更新并在所有设备上同步

### 方法二：通过代码修改

1. 将您的图片上传到图片托管服务，获取图片URL
2. 在 `src/lib/productData.ts` 文件中，找到 `imageDb` 对象定义
3. 在 `productImages` 或 `categoryImages` 对象中添加或修改对应的图片URL：
   ```typescript
   // 在 imageDb 对象中添加或修改图片
   export const imageDb: ImageDatabase = {
     productImages: {
       1: "https://lf-code-agent.coze.cn/obj/x-ai-cn/320719794690/attachment/87d19e4a-abc1-4554-a378-b55cf3c5056f_20260109170801.jpg",
       // 添加更多产品图片ID和URL
       // 例如: 2: "您的产品图片URL",
     },
     
     categoryImages: {
       1: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
       // 添加更多类别图片ID和URL
       // 例如: 9: "您的类别图片URL",
     },
     
     defaultImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=solid%20red%20background&sign=975fa253f980fadea83ff085bf52c70b"
   };
   ```

## 修改完成后

### 通过后台修改

无需额外操作，所有更改会自动保存并同步到所有设备。

### 通过代码修改

修改完成后，您需要重新构建项目以应用更改：

1. 打开终端或命令提示符
2. 导航到项目目录
3. 运行以下命令：
   ```bash
   pnpm install
   pnpm run build
   ```

4. 构建完成后，更新后的网站文件将生成在 `dist` 目录中
5. 重启Node.js服务器使更改生效

## 常见问题解答

**Q: 为什么我修改了数据，但网站上没有变化？**
A: 请确保您修改了正确的文件，并重新构建了项目。另外，清除浏览器缓存或点击页面上的"Update"按钮（如果显示）也能解决问题。

**Q: 我可以添加全新的产品类别吗？**
A: 可以，您需要：
1. 在 `productCategories` 数组中添加新的类别对象
2. 创建对应的产品数据数组
3. 在导航和相关页面中添加对新类别的引用

**Q: 如何访问网站的管理后台？**
A: 网站提供了一个管理员后台界面，您可以通过以下方式访问：
1. 在浏览器中访问 `https://your-domain.com/admin/login`
2. 使用默认的管理员账号 `admin` 和密码 `password123` 登录
3. 登录后，您可以在后台界面直接编辑产品信息和博客文章，无需直接修改代码文件

**Q: 修改数据需要编程知识吗？**
A: 基本的编程知识会有所帮助，但通过管理后台界面，即使没有编程经验也可以完成简单的数据修改。

**Q: 如何确保所有设备都能看到最新的内容？**
A: 系统会自动处理数据同步。当您在管理后台修改内容后，其他设备在访问网站时会收到更新提示，点击更新按钮即可查看最新内容。您也可以使用"Export Data"和"Import Data"功能在设备间手动同步数据。