
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { productCategories, getAllProducts, getProductsByCategory, getFeaturedProducts } from '@/lib/productData';
import { productDb, db } from '@/services/dbService';
import { PublicDataSyncIndicator } from '@/pages/LoginPage';

// 实际使用中，建议将PublicDataSyncIndicator组件移到共享组件目录


export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 获取当前显示的产品，优先从服务器获取最新数据
  const [products, setProducts] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 从服务器获取产品数据
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const allProducts = await productDb.fetchAll();
      
      let filteredProducts = [];
      
      if (selectedCategory) {
        const category = productCategories.find(cat => cat.id === selectedCategory);
        if (category) {
          filteredProducts = allProducts.filter(product => 
            product.category === category.name && 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      } else {
        filteredProducts = allProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // 根据排序选项排序产品
      switch (sortBy) {
        case "newest":
          setProducts([...filteredProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          break;
        case "nameAsc":
          setProducts([...filteredProducts].sort((a, b) => a.name.localeCompare(b.name)));
          break;
        case "nameDesc":
          setProducts([...filteredProducts].sort((a, b) => b.name.localeCompare(a.name)));
          break;
        case "rating":
          setProducts([...filteredProducts].sort((a, b) => b.rating - a.rating));
          break;
        default:
          setProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // 使用本地存储的默认数据
      let defaultProducts = [];
      
      if (selectedCategory) {
        const category = productCategories.find(cat => cat.id === selectedCategory);
        if (category) {
          defaultProducts = getProductsByCategory(category.name).filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      } else {
        defaultProducts = getAllProducts().filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setProducts(defaultProducts);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 当筛选条件改变时重新获取数据
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]);
  
  // 添加数据更新监听，确保后台修改后能及时刷新前台显示
  useEffect(() => {
    const handleDataUpdate = () => {
      // 重新从服务器获取数据
      fetchProducts();
      
      // 重新加载图片数据库，确保获取最新的图片URL
      db.loadImageDb();
    };
    
    // 使用dbService提供的事件监听
    const unsubscribe = db.onDataUpdate(handleDataUpdate);
    
    // 同时监听localStorage的直接变化，确保所有数据变更都能被捕获
    const handleStorageChange = () => {
      handleDataUpdate();};
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedCategory, searchTerm, sortBy]);
  
  // 同步数据按钮处理函数
  const handleSyncData = async () => {
    await db.syncAllData();
    // 重新获取数据
    fetchProducts();
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-72 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Our Products
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl"
            >
              Explore our comprehensive range of premium tin packaging solutions
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <SectionHeader 
              title={selectedCategory 
                ? `${productCategories.find(cat => cat.id === selectedCategory)?.name}` 
                : "All Products"} 
              subtitle={`Displaying ${products.length} products`}
              align="left"
            />
            
             {/* Search and Sort Controls */}
            <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="w-full md:w-64">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white"
                  />
                  <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              
              {/* Sort Dropdown */}
              <div className="w-full md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="nameAsc">Name A-Z</option>
                  <option value="nameDesc">Name Z-A</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              {/* Sync Data Button */}
              <button
                onClick={handleSyncData}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center"
                title="Sync data with server"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-sync-alt"></i>
                )}
                <span className="ml-2 hidden sm:inline">Sync</span>
              </button>
            </div>
          </div>
          
          {/* Categories Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === null 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              All Categories
            </button>
            
            {productCategories.map((category) => (
              <button 
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
          
          {/* Product Grid */}
          {selectedCategory === null ? (
            // 显示类别卡片
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {productCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  icon={category.icon}
                  count={category.count}
                  imageUrl={category.imageUrl}
                />
              ))}
            </motion.div>
          ) : (
            // 显示产品列表
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {isLoading ? (
                // 显示加载骨架屏
                Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                ))
              ) : products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  imageUrl={product.imageUrl}
                  category={product.category}
                  description={product.shortDescription}
                />
              ))}
            </motion.div>
          )}
          
          {/* Empty State */}
          {!isLoading && products.length === 0 && (
            <div className="text-center py-16">
              <i className="fas fa-box-open text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
       {/* Featured Products */}
      {selectedCategory === null && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <SectionHeader 
              title="Featured Products" 
              subtitle="Handpicked selection of our most popular items" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {getFeaturedProducts(4).map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  imageUrl={product.imageUrl}
                  category={product.category}
                  description={product.shortDescription}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* 数据同步提示 */}
      <PublicDataSyncIndicator />
      
      {/* Custom Solutions Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">

        </div>
      </section>
      
      <Footer />
    </div>
  );
}