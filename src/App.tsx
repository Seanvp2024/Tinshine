import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { Empty } from "@/components/Empty";
import { AuthProvider } from "@/contexts/authContext";
import { db } from "@/services/dbService";

// 初始化数据库服务
db.initializeCollection('products', []);
db.initializeCollection('blogPosts', []);
db.initializeCollection('categories', []);

// 加载保存的图片数据库
db.loadImageDb();

// 主要页面
import AboutPage from "@/pages/AboutPage";
import ProductsPage from "@/pages/ProductsPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";

// 产品子类别页面
import FoodIronBoxPage from "@/pages/FoodIronBoxPage";
import WineCansPage from "@/pages/WineCansPage";
import CosmeticTinPage from "@/pages/CosmeticTinPage";
import TeaCoffeeTinPage from "@/pages/TeaCoffeeTinPage";
import HouseholdGoodsTinPage from "@/pages/HouseholdGoodsTinPage";
import TinplateCanPage from "@/pages/TinplateCanPage";
import GiftTinPage from "@/pages/GiftTinPage";
import NewProductDisplayPage from "@/pages/NewProductDisplayPage";

// Admin pages - 统一的后台路由
import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/AdminDashboard";

// 确保在浏览器环境中运行
const handleBackNavigation = () => {
  if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
    return window.history.back();
  }
  return null;
};

export default function App() {
  // 确保在页面加载时同步最新数据
  useEffect(() => {
    const syncDataOnLoad = async () => {
      try {
        // 检查是否有新版本数据
        const currentVersion = await db.getCurrentVersion();
        const hasUpdate = await db.checkForUpdates(currentVersion);
        
        if (hasUpdate) {
          // 自动同步数据
          await db.syncAllData();
          console.log('Data synced on app load');
        }
      } catch (error) {
        console.error('Error syncing data on load:', error);
      }
    };
    
    // 应用启动时同步数据
    syncDataOnLoad();
  }, []);

  // 设置全局数据更新监听，确保在页面加载时获取最新数据
  useEffect(() => {
    const handleDataUpdate = () => {
      // 这个处理函数会在数据更新时被调用
      // 在实际应用中，这里可以添加一些全局状态更新逻辑
      console.log('Data updated globally');
      // 可以在这里添加重新加载数据的逻辑
    };

    const unsubscribe = db.onDataUpdate(handleDataUpdate);
    
    // 设置自动同步机制，每15分钟检查一次更新
    const stopAutoSync = db.setupAutoSync(15);
    
    return () => {
      unsubscribe();
      stopAutoSync();
    };
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* 前台页面路由 */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:id" element={<ProductsPage />} />
        <Route path="/category/:id" element={<ProductsPage />} />
        
        {/* 产品子类别路由 */}
        <Route path="/product/food-iron-box" element={<FoodIronBoxPage />} />
        <Route path="/product/wine-cans" element={<WineCansPage />} />
        <Route path="/product/cosmetic-tin" element={<CosmeticTinPage />} />
        <Route path="/product/tea-coffee-tin" element={<TeaCoffeeTinPage />} />
        <Route path="/product/household-goods-tin" element={<HouseholdGoodsTinPage />} />
        <Route path="/product/tinplate-can" element={<TinplateCanPage />} />
        <Route path="/product/gift-tin" element={<GiftTinPage />} />
        <Route path="/product/new-product-display" element={<NewProductDisplayPage />} />
        
        {/* 后台管理系统路由 - 统一的路由前缀 */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* 404路由 */}
        <Route path="*" element={<ProductsPage />} />
      </Routes>
    </AuthProvider>
  );
}