import { Product, ProductCategory, imageDb } from "@/lib/productData";
import { toast } from 'sonner';

// 定义数据库集合类型
export type CollectionType = 'products' | 'blogPosts' | 'categories' | string;

// 定义基础数据模型接口
export interface BaseModel {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// 定义事务接口
interface TransactionOptions {
  readCollections?: CollectionType[];
  writeCollections?: CollectionType[];
}

// 定义一个唯一的应用ID，用于在多标签页之间同步数据
export const APP_ID = 'tinshine_packaging';

// 数据版本控制键
const DATA_VERSION_KEY = `${APP_ID}_data_version`;

// 同步数据导出键
export const SYNC_DATA_KEY = `${APP_ID}_sync_data`;

// 服务器API基础URL
// 优先从环境变量获取，如果没有则使用默认值
// 在生产环境中，确保设置了正确的环境变量
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// 模拟数据库服务类
export class DatabaseService {
  // 事务队列 - 用于确保数据一致性
  private transactionQueue: Promise<void> = Promise.resolve();
  
  // API请求函数
  private async apiRequest<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error in API request to ${endpoint}:`, error);
      
      // 降级到localStorage
      if (method === 'GET') {
        console.log('Falling back to localStorage');
        // 这里可以返回localStorage中的数据作为降级方案
        return Promise.resolve({} as T);
      }
      
      throw error;
    }
  }
  
  // 获取集合数据
  getCollection<T extends BaseModel>(collectionName: CollectionType): T[] {
    try {
      const data = localStorage.getItem(`${APP_ID}_${collectionName}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error fetching collection ${collectionName} from localStorage:`, error);
      return [];
    }
  }

  // 保存集合数据到localStorage
  saveCollection<T extends BaseModel>(collectionName: CollectionType, data: T[]): void {
    try {
      // 深拷贝数据以避免引用问题
      const dataToSave = JSON.parse(JSON.stringify(data));
      localStorage.setItem(`${APP_ID}_${collectionName}`, JSON.stringify(dataToSave));
      // 触发数据更新事件
      this.notifyDataUpdate(collectionName);
    } catch (error) {
      console.error(`Error saving collection ${collectionName} to localStorage:`, error);
    }
  }

  // 保存图片数据库
  saveImageDb(): void {
    try {
      // 创建深拷贝以避免引用问题
      const imageDbToSave = JSON.parse(JSON.stringify(imageDb));
      localStorage.setItem(`${APP_ID}_imageDb`, JSON.stringify(imageDbToSave));
      this.notifyDataUpdate('imageDb');
    } catch (error) {
      console.error('Error saving image database:', error);
    }
  }

  // 加载图片数据库
  loadImageDb(): void {
    try {
      const savedImageDb = localStorage.getItem(`${APP_ID}_imageDb`);
      if (savedImageDb) {
        const parsedDb = JSON.parse(savedImageDb);
        // 完全替换而不是合并，确保数据一致性
        imageDb.productImages = parsedDb.productImages || {};
        imageDb.categoryImages = parsedDb.categoryImages || {};
        imageDb.defaultImage = parsedDb.defaultImage || imageDb.defaultImage;
      }
    } catch (error) {
      console.error('Error loading image database:', error);
    }
  }

  // 获取单个记录
  getById<T extends BaseModel>(collectionName: CollectionType, id: number): T | undefined {
    const collection = this.getCollection<T>(collectionName);
    return collection.find(item => item.id === id);
  }

  // 添加记录（异步版本）
  async addAsync<T extends BaseModel>(collectionName: CollectionType, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      // 尝试通过API添加
      const endpoint = collectionName === 'products' ? '/products' : 
                       collectionName === 'blogPosts' ? '/blogs' : 
                       collectionName === 'categories' ? '/categories' : `/${collectionName}`;
      
      const newItem = await this.apiRequest<T>(endpoint, 'POST', item);
      
      // 更新localStorage
      const collection = this.getCollection<T>(collectionName);
      collection.unshift(newItem);
      this.saveCollection(collectionName, collection);
      
      return newItem;
    } catch (error) {
      console.error(`Failed to add item to ${collectionName} via API, falling back to localStorage`);
      
      // 降级到localStorage
      const collection = this.getCollection<T>(collectionName);
      const now = new Date().toISOString();
      
      const newItem = {
        ...item,
        id: Date.now(),
        createdAt: now,
        updatedAt: now
      } as T;
      
      collection.unshift(newItem);
      this.saveCollection(collectionName, collection);
      
      return newItem;
    }
  }

  // 更新记录（异步版本）
  async updateAsync<T extends BaseModel>(collectionName: CollectionType, id: number, updatedData: Partial<T>): Promise<T | null> {
    try {
      // 尝试通过API更新
      const endpoint = collectionName === 'products' ? `/products/${id}` : 
                       collectionName === 'blogPosts' ? `/blogs/${id}` : 
                       collectionName === 'categories' ? `/categories/${id}` : `/${collectionName}/${id}`;
      
      const updatedItem = await this.apiRequest<T>(endpoint, 'PUT', updatedData);
      
      // 更新localStorage
      const collection = this.getCollection<T>(collectionName);
      const index = collection.findIndex(item => item.id === id);
      
      if (index !== -1) {
        collection[index] = updatedItem;
        this.saveCollection(collectionName, collection);
      }
      
      // 同时更新图片数据库
      if (collectionName === 'products' && typeof (updatedData as any).imageUrl === 'string') {
        (imageDb.productImages as Record<number, string>)[id] = (updatedData as any).imageUrl;
        this.saveImageDb();
      }
      
      return updatedItem;
    } catch (error) {
      console.error(`Failed to update item in ${collectionName} via API, falling back to localStorage`);
      
      // 降级到localStorage
      const collection = this.getCollection<T>(collectionName);
      const index = collection.findIndex(item => item.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const updatedItem = {
        ...collection[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      } as T;
      
      collection[index] = updatedItem;
      this.saveCollection(collectionName, collection);
      
      // 同时更新图片数据库
      if (collectionName === 'products' && typeof (updatedData as any).imageUrl === 'string') {
        (imageDb.productImages as Record<number, string>)[id] = (updatedData as any).imageUrl;
        this.saveImageDb();
      }
      
      return updatedItem;
    }
  }

  // 删除记录（异步版本）
  async deleteAsync<T extends BaseModel>(collectionName: CollectionType, id: number): Promise<boolean> {
    try {
      // 尝试通过API删除
      const endpoint = collectionName === 'products' ? `/products/${id}` : 
                       collectionName === 'blogPosts' ? `/blogs/${id}` : 
                       collectionName === 'categories' ? `/categories/${id}` : `/${collectionName}/${id}`;
      
      await this.apiRequest(endpoint, 'DELETE');
      
      // 更新localStorage
      const collection = this.getCollection<T>(collectionName);
      const filteredCollection = collection.filter(item => item.id !== id);
      
      if (filteredCollection.length !== collection.length) {
        this.saveCollection(collectionName, filteredCollection);
        
        // 如果是产品，同时从图片数据库中删除相关图片
        if (collectionName === 'products') {
          delete (imageDb.productImages as Record<number, string>)[id];
          this.saveImageDb();
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Failed to delete item from ${collectionName} via API, falling back to localStorage`);
      
      // 降级到localStorage
      const collection = this.getCollection<T>(collectionName);
      const initialLength = collection.length;
      
      const filteredCollection = collection.filter(item => item.id !== id);
      
      if (filteredCollection.length === initialLength) {
        return false; // 没有找到要删除的记录
      }
      
      this.saveCollection(collectionName, filteredCollection);
      
      // 如果是产品，同时从图片数据库中删除相关图片
      if (collectionName === 'products') {
        delete (imageDb.productImages as Record<number, string>)[id];
        this.saveImageDb();
      }
      
      return true;
    }
  }

  // 按条件查找记录
  find<T extends BaseModel>(collectionName: CollectionType, query: Partial<T>): T[] {
    const collection = this.getCollection<T>(collectionName);
    
    return collection.filter(item => {
      // 检查所有查询条件是否匹配
      return Object.entries(query).every(([key, value]) => {
        // 安全地访问属性
        const itemValue = (item as any)[key];
        // 支持模糊匹配
        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return itemValue === value;
      });
    });
  }

  // 清空集合
  clearCollection(collectionName: CollectionType): void {
    try {
      localStorage.removeItem(`${APP_ID}_${collectionName}`);
      this.notifyDataUpdate(collectionName);
    } catch (error) {
      console.error(`Error clearing collection ${collectionName}:`, error);
    }
  }

  // 初始化集合（如果不存在）
  initializeCollection<T extends BaseModel>(collectionName: CollectionType, initialData: T[]): void {
    const existingData = this.getCollection<T>(collectionName);
    if (existingData.length === 0) {
      this.saveCollection(collectionName, initialData);
    }
  }

  // 获取记录总数
  count(collectionName: CollectionType): number {
    return this.getCollection(collectionName).length;
  }

  // 通知数据更新（包括多标签页同步）
  private notifyDataUpdate(collectionName: CollectionType): void {
    // 触发自定义事件用于同一页面内的组件更新
    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { collectionName } }));
    
    // 使用localStorage事件用于多标签页之间的同步
    const timestamp = Date.now();
    localStorage.setItem(`${APP_ID}_sync_timestamp`, timestamp.toString());
  }

  // 设置数据更新监听器
  onDataUpdate(callback: (event: CustomEvent<{ collectionName: string }>) => void): () => void {
    // 直接使用回调函数，addEventListener 可以接受函数类型
    window.addEventListener('dataUpdated', callback);
    
    // 监听localStorage事件用于多标签页同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${APP_ID}_sync_timestamp` && e.newValue) {
        // 当检测到其他标签页的更改时，触发数据更新事件
        const collectionNames = ['products', 'blogPosts', 'categories', 'imageDb'];
        collectionNames.forEach(collectionName => {
          window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { collectionName } }));
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 返回清理函数
    return () => {
      window.removeEventListener('dataUpdated', callback);
      window.removeEventListener('storage', handleStorageChange);
    };
  }
  
  // 自动同步机制 - 定期检查并同步数据
  setupAutoSync(intervalMinutes: number = 15): () => void {
    const syncInterval = setInterval(async () => {
      try {
        // 仅在用户活跃时同步
        if (document.visibilityState === 'visible') {
          const currentVersion = await this.getCurrentVersion();
          const hasUpdate = await this.checkForUpdates(currentVersion);
          
          if (hasUpdate) {
            console.log('New data available, syncing...');
            await this.syncAllData();
          }
        }
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, intervalMinutes * 60 * 1000);
    
    // 返回清理函数
    return () => clearInterval(syncInterval);
  }

  // 获取当前数据版本号（从服务器）
  async getCurrentVersion(): Promise<number> {
    try {
      const versionData = await this.apiRequest<{ version: number }>('/version');
      return versionData.version;
    } catch (error) {
      console.error('Error getting data version from server:', error);
      // 降级到localStorage
      try {
        return parseInt(localStorage.getItem(DATA_VERSION_KEY) || '0', 10);
      } catch (localError) {
        console.error('Error getting data version from localStorage:', localError);
        return 0;
      }
    }
  }

  // 检查是否有更新（从服务器）
  async checkForUpdates(currentVersion: number): Promise<boolean> {
    try {
      const versionData = await this.apiRequest<{ version: number }>('/version');
      return versionData.version > currentVersion;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  }

  // 从服务器同步所有数据
  async syncAllData(): Promise<boolean> {
    try {
      const syncData = await this.apiRequest<{
        version: { version: number; lastUpdated: string };
        products: Product[];
        blogs: any[];
        categories: ProductCategory[];
      }>('/sync/all');
      
      // 保存同步的数据到localStorage
      if (syncData.products && Array.isArray(syncData.products)) {
        this.saveCollection('products', syncData.products);
      }
      
      if (syncData.blogs && Array.isArray(syncData.blogs)) {
        this.saveCollection('blogPosts', syncData.blogs);
      }
      
      if (syncData.categories && Array.isArray(syncData.categories)) {
        this.saveCollection('categories', syncData.categories);
      }
      
      // 更新版本号
      if (syncData.version) {
        localStorage.setItem(DATA_VERSION_KEY, syncData.version.version.toString());
      }
      
      // 触发全局数据更新事件
      this.notifyDataUpdate('all');
      
      toast.success('Data synchronized successfully with server');
      return true;
    } catch (error) {
      console.error('Error syncing data with server:', error);
      toast.error('Failed to synchronize data with server');
      return false;
    }
  }

  // 从服务器获取所有产品
  async fetchAllProducts(): Promise<Product[]> {
    try {
      const products = await this.apiRequest<Product[]>('/products');
      // 保存到localStorage
      this.saveCollection('products', products);
      return products;
    } catch (error) {
      console.error('Error fetching products from server:', error);
      // 降级到localStorage
      return this.getCollection<Product>('products');
    }
  }

  // 从服务器获取所有博客
  async fetchAllBlogs(): Promise<any[]> {
    try {
      const blogs = await this.apiRequest<any[]>('/blogs');
      // 保存到localStorage
      this.saveCollection('blogPosts', blogs);
      return blogs;
    } catch (error) {
      console.error('Error fetching blogs from server:', error);
      // 降级到localStorage
      return this.getCollection('blogPosts');
    }
  }

  // 执行事务，确保数据一致性
  executeTransaction<T>(callback: () => T, options?: TransactionOptions): T {
    // 将操作加入队列，确保顺序执行
    let result: T;
    this.transactionQueue = this.transactionQueue.then(() => {
      // 在实际应用中，这里可能需要加锁或其他并发控制机制
      try {
        result = callback();
      } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
      }
    });
    
    return result as T;
  }
  
  // 导入数据功能，用于从文件导入更新
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      // 验证数据格式
      if (!data.version || !data.products || !data.blogs) {
        throw new Error('Invalid data format');
      }
      
      // 检查版本号是否比当前版本新
      const currentVersion = parseInt(localStorage.getItem(DATA_VERSION_KEY) || '0', 10);
      if (data.version.version <= currentVersion) {
        return false;
      }
      
      // 保存数据
      if (data.products) {
        this.saveCollection('products', data.products);
      }
      
      if (data.blogs) {
        this.saveCollection('blogPosts', data.blogs);
      }
      
      if (data.categories) {
        this.saveCollection('categories', data.categories);
      }
      
      // 更新版本号
      localStorage.setItem(DATA_VERSION_KEY, data.version.version.toString());
      
      // 触发全局数据更新事件
      this.notifyDataUpdate('all');
      
      toast.success('Data imported successfully!');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data. Invalid format.');
      return false;
    }
  }
  
  // 导出数据功能，用于生成可共享的数据文件
  exportData(): string {
    try {
      const data = {
        version: {
          version: parseInt(localStorage.getItem(DATA_VERSION_KEY) || '1', 10),
          lastUpdated: new Date().toISOString()
        },
        products: this.getCollection<Product>('products'),
        blogs: this.getCollection('blogPosts'),
        categories: this.getCollection<ProductCategory>('categories')
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
      return '{}';
    }
  }
}

// 创建数据库服务实例
export const db = new DatabaseService();

// 导出便捷的类型别名和函数
export const productDb = {
  getAll: () => db.getCollection<Product>('products'),
  getById: (id: number) => db.getById<Product>('products', id),
  add: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => db.addAsync<Product>('products', product),
  update: (id: number, data: Partial<Product>) => db.updateAsync<Product>('products', id, data),
  delete: (id: number) => db.deleteAsync<Product>('products', id),
  find: (query: Partial<Product>) => db.find<Product>('products', query),
  count: () => db.count('products'),
  fetchAll: () => db.fetchAllProducts()
};

export const categoryDb = {
  getAll: () => db.getCollection<ProductCategory>('categories'),
  getById: (id: number) => db.getById<ProductCategory>('categories', id),
  add: (category: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>) => db.addAsync<ProductCategory>('categories', category),
  update: (id: number, data: Partial<ProductCategory>) => db.updateAsync<ProductCategory>('categories', id, data),
  delete: (id: number) => db.deleteAsync<ProductCategory>('categories', id),
  count: () => db.count('categories')
};

export const blogDb = {
  getAll: () => db.getCollection('blogPosts'),
  getById: (id: number) => db.getById('blogPosts', id),
  add: (blogPost: any) => db.addAsync('blogPosts', blogPost),
  update: (id: number, data: Partial<any>) => db.updateAsync('blogPosts', id, data),
  delete: (id: number) => db.deleteAsync('blogPosts', id),
  find: (query: Partial<any>) => db.find('blogPosts', query),
  count: () => db.count('blogPosts'),
  fetchAll: () => db.fetchAllBlogs()
};