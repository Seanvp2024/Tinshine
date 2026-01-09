import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext, verifyCredentials } from '@/contexts/authContext';
import { db, APP_ID, SYNC_DATA_KEY } from '@/services/dbService';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (verifyCredentials(username, password)) {
        setIsAuthenticated(true);
        toast.success('Login successful! Redirecting to admin panel...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        toast.error('Invalid username or password');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              <i className="fas fa-shield-alt text-white text-2xl"></i>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Admin Panel Login
            </motion.h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              This is a restricted area. Please enter your credentials to continue.
            </p>
          </div>
        </div>
        
        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-key text-gray-400"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Default credentials:</span>
              <span className="ml-1 text-blue-600 dark:text-blue-400">admin / password123</span>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing in...
                </div>
              ) : (
                <span>Sign in to Admin Panel</span>
              )}
            </motion.button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is a private admin area. If you don't have access, please contact the site administrator.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

  // 数据同步状态指示器（用于前台页面）
export function PublicDataSyncIndicator() {
  const [lastSync, setLastSync] = useState<string>('Never');
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  
  // 检查同步状态
  useEffect(() => {
    // 获取上次同步时间
    const syncTime = localStorage.getItem(`${APP_ID}_last_sync`);
    if (syncTime) {
      setLastSync(new Date(parseInt(syncTime)).toLocaleString());
    }
    
    // 初始检查更新
    checkForUpdates();
    
    // 设置定期检查同步的定时器
    const checkSyncInterval = setInterval(() => {
      checkForUpdates();
    }, 60000); // 每分钟检查一次
    
    return () => clearInterval(checkSyncInterval);
  }, []);
  
  // 检查是否有更新
  const checkForUpdates = async () => {
    if (isCheckingUpdate) return;
    
    setIsCheckingUpdate(true);
    try {
      // 从服务器检查版本
      const currentVersion = await db.getCurrentVersion();
      const hasNewUpdate = await db.checkForUpdates(currentVersion);
      setHasUpdate(hasNewUpdate);
    } catch (error) {
      console.error('Error checking for updates:', error);
    } finally {
      setIsCheckingUpdate(false);
    }
  };
  
  // 同步数据
  const handleSyncData = async () => {
    try {
      setIsCheckingUpdate(true);
      const success = await db.syncAllData();
      
      if (success) {
        toast.success('Data updated successfully!');
        setLastSync(new Date().toLocaleString());
        setHasUpdate(false);
        localStorage.setItem(`${APP_ID}_last_sync`, Date.now().toString());
        
        // 刷新页面以显示最新数据
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error('Failed to update data');
      }
    } catch (error) {
      toast.error('Error updating data');
      console.error('Error during update:', error);
    } finally {
      setIsCheckingUpdate(false);
    }
  };
  
  // 添加强制同步按钮（始终显示）
  const handleForceSync = async () => {
    try {
      setIsCheckingUpdate(true);
      const success = await db.syncAllData();
      
      if (success) {
        toast.success('Data refreshed successfully!');
        setLastSync(new Date().toLocaleString());
        localStorage.setItem(`${APP_ID}_last_sync`, Date.now().toString());
      } else {
        toast.error('Failed to refresh data');
      }
    } catch (error) {
      toast.error('Error refreshing data');
      console.error('Error during refresh:', error);
    } finally {
      setIsCheckingUpdate(false);
    }
  };
  
  // 显示新版本通知
  if (hasUpdate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 flex items-center justify-between max-w-xs">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
              <i className="fas fa-sync-alt text-green-600 dark:text-green-400"></i>
            </div>
            <div>
              <h4 className="font-medium">New content available</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Click to update</p>
            </div>
          </div>
          <button
            onClick={handleSyncData}
            className="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
          >
            Update
          </button>
        </div>
      </motion.div>
    );
  }
  
  // 显示强制刷新按钮
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <button
        onClick={handleForceSync}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 transition-all duration-300 flex items-center justify-center"
        title="Refresh data from server"
      >
        <i className="fas fa-sync-alt"></i>
      </button>
    </motion.div>
  );
}