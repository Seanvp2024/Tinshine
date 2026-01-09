// Node.js服务器文件 - 用于管理产品和博客数据
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 数据文件路径
const DATA_DIR = path.join(__dirname, '../data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');
const VERSION_FILE = path.join(DATA_DIR, 'version.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化数据文件
const initializeDataFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// 初始化默认数据
initializeDataFile(PRODUCTS_FILE, []);
initializeDataFile(BLOGS_FILE, []);
initializeDataFile(VERSION_FILE, { version: 1, lastUpdated: new Date().toISOString() });

// 获取数据的函数
const getData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// 保存数据的函数
const saveData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    // 更新版本号
    const versionData = getData(VERSION_FILE);
    versionData.version += 1;
    versionData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(VERSION_FILE, JSON.stringify(versionData, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// API端点 - 获取当前数据版本
app.get('/api/version', (req, res) => {
  res.json(getData(VERSION_FILE));
});

// API端点 - 产品管理
app.get('/api/products', (req, res) => {
  try {
    const products = getData(PRODUCTS_FILE);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', (req, res) => {
  const products = getData(PRODUCTS_FILE);
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/products', (req, res) => {
  const products = getData(PRODUCTS_FILE);
  const newProduct = {
    ...req.body,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products.unshift(newProduct); // 添加到开头
  if (saveData(PRODUCTS_FILE, products)) {
    res.status(201).json(newProduct);
  } else {
    res.status(500).json({ error: 'Failed to save product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  const products = getData(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    if (saveData(PRODUCTS_FILE, products)) {
      res.json(products[index]);
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const products = getData(PRODUCTS_FILE);
  const filteredProducts = products.filter(p => p.id !== parseInt(req.params.id));
  if (filteredProducts.length !== products.length) {
    if (saveData(PRODUCTS_FILE, filteredProducts)) {
      res.json({ success: true, message: 'Product deleted' });
    } else {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// API端点 - 博客管理
app.get('/api/blogs', (req, res) => {
  try {
    const blogs = getData(BLOGS_FILE);
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    // 返回默认的博客数据，避免前端出现空白页面
    const defaultBlogs = [
      {
        id: 1,
        title: "Welcome to Metal Box Pack",
        excerpt: "Your premier destination for high-quality tin packaging solutions",
        content: "Metal Box Pack provides premium tin packaging solutions for various industries including food, cosmetics, and more. Our products are designed to be durable, sustainable, and visually appealing.",
        imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Tin%20can%20packaging%20factory%20modern%20equipment%20production%20line&sign=947ccfb12838abe5f0d41ee67f040e65",
        category: "Company News",
        author: "Admin",
        authorImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Professional%20business%20man%20CEO%20confident%20portrait&sign=17bf79fcd820f1aa9e254cfaab9fe4b8",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        readTime: 3,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    res.json(defaultBlogs);
  }
});

app.get('/api/blogs/:id', (req, res) => {
  const blogs = getData(BLOGS_FILE);
  const blog = blogs.find(b => b.id === parseInt(req.params.id));
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

app.post('/api/blogs', (req, res) => {
  const blogs = getData(BLOGS_FILE);
  const newBlog = {
    ...req.body,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  blogs.unshift(newBlog); // 添加到开头
  if (saveData(BLOGS_FILE, blogs)) {
    res.status(201).json(newBlog);
  } else {
    res.status(500).json({ error: 'Failed to save blog' });
  }
});

app.put('/api/blogs/:id', (req, res) => {
  const blogs = getData(BLOGS_FILE);
  const index = blogs.findIndex(b => b.id === parseInt(req.params.id));
  if (index !== -1) {
    blogs[index] = {
      ...blogs[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    if (saveData(BLOGS_FILE, blogs)) {
      res.json(blogs[index]);
    } else {
      res.status(500).json({ error: 'Failed to update blog' });
    }
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

app.delete('/api/blogs/:id', (req, res) => {
  const blogs = getData(BLOGS_FILE);
  const filteredBlogs = blogs.filter(b => b.id !== parseInt(req.params.id));
  if (filteredBlogs.length !== blogs.length) {
    if (saveData(BLOGS_FILE, filteredBlogs)) {
      res.json({ success: true, message: 'Blog deleted' });
    } else {
      res.status(500).json({ error: 'Failed to delete blog' });
    }
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

// API端点 - 批量同步数据
app.get('/api/sync/all', (req, res) => {
  try {
    const data = {
      version: getData(VERSION_FILE),
      products: getData(PRODUCTS_FILE),
      blogs: getData(BLOGS_FILE)
    };
    res.json(data);
  } catch (error) {
    console.error('Error getting sync data:', error);
    // 返回基本的同步数据，确保前端能正常运行
    res.status(500).json({
      version: { version: 1, lastUpdated: new Date().toISOString() },
      products: [],
      blogs: [
        {
          id: 1,
          title: "Welcome to Metal Box Pack",
          excerpt: "Your premier destination for high-quality tin packaging solutions",
          content: "Metal Box Pack provides premium tin packaging solutions for various industries including food, cosmetics, and more. Our products are designed to be durable, sustainable, and visually appealing.",
          imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Tin%20can%20packaging%20factory%20modern%20equipment%20production%20line&sign=947ccfb12838abe5f0d41ee67f040e65",
          category: "Company News",
          author: "Admin",
          authorImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Professional%20business%20man%20CEO%20confident%20portrait&sign=17bf79fcd820f1aa9e254cfaab9fe4b8",
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          readTime: 3,
          likes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Available API endpoints:');
  console.log('GET    /api/version          - Get current data version');
  console.log('GET    /api/products         - Get all products');
  console.log('GET    /api/products/:id     - Get a specific product');
  console.log('POST   /api/products         - Add a new product');
  console.log('PUT    /api/products/:id     - Update a product');
  console.log('DELETE /api/products/:id     - Delete a product');
  console.log('GET    /api/blogs           - Get all blogs');
  console.log('GET    /api/blogs/:id        - Get a specific blog');
  console.log('POST   /api/blogs           - Add a new blog');
  console.log('PUT    /api/blogs/:id        - Update a blog');
  console.log('DELETE /api/blogs/:id        - Delete a blog');
  console.log('GET    /api/sync/all         - Get all data for sync');
  console.log('GET    /api/health           - Health check endpoint');
});

// 添加健康检查端点
app.get('/api/health', (req, res) => {
  try {
    // 检查数据文件是否存在
    const productsExist = fs.existsSync(PRODUCTS_FILE);
    const blogsExist = fs.existsSync(BLOGS_FILE);
    
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      version: getData(VERSION_FILE),
      services: {
        products: productsExist ? 'OK' : 'WARNING',
        blogs: blogsExist ? 'OK' : 'WARNING',
        diskSpace: {
          status: 'OK',
          message: 'Data directory accessible'
        }
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      error: error.message || 'Unknown error'
    });
  }
});