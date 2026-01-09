import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

// 确保在应用启动时初始化数据库
import { db } from "./services/dbService";
// 初始化数据库集合
// 注意：这些初始化操作在App.tsx中已经执行，这里不再重复
// db.initializeCollection('products', []);
// db.initializeCollection('blogPosts', []);
// db.initializeCollection('categories', []);

// 加载保存的图片数据库
db.loadImageDb();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
