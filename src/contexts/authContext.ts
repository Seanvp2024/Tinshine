import React, { createContext, useState, useEffect, ReactNode } from "react";
import { storage } from "@/lib/utils";

// 定义AuthContext的数据结构
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

// 创建AuthContext
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

// AuthProvider组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // 检查localStorage中是否有已保存的认证状态
    const savedAuth = storage.get<boolean>('isAuthenticated');
    return savedAuth || false;
  });

  // 当认证状态改变时，保存到localStorage
  useEffect(() => {
    storage.set('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  // 登出函数
  const logout = () => {
    setIsAuthenticated(false);
    storage.remove('isAuthenticated');
  };

  // 使用正确的React.createElement语法
  return React.createElement(
    AuthContext.Provider,
    { value: { isAuthenticated, setIsAuthenticated, logout } },
    children
  );
}

// 验证凭证函数
export const verifyCredentials = (username: string, password: string): boolean => {
  // 简单的模拟验证逻辑
  // 实际项目中应该调用API进行验证
  // 注意：在生产环境中应使用更安全的验证方式
  return username === 'admin' && password === 'password123';
};