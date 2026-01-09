import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

// 定义导航链接类型
interface NavLink {
  name: string;
  path: string;
  isDropdown?: boolean;
  dropdownItems?: { name: string; path: string }[];
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  // 监听滚动事件，更新导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 产品下拉菜单数据
  const productDropdownItems = [
    { name: 'Food iron box', path: '/product/food-iron-box' },
    { name: 'Wine cans', path: '/product/wine-cans' },
    { name: 'Cosmetic tin', path: '/product/cosmetic-tin' },
    { name: 'Tea coffee tin', path: '/product/tea-coffee-tin' },
    { name: 'Household goods tin', path: '/product/household-goods-tin' },
    { name: 'Tinplate can', path: '/product/tinplate-can' },
    { name: 'Gift tin', path: '/product/gift-tin' },
    { name: 'New product display', path: '/product/new-product-display' }
  ];

  // Navigation links data
  const navLinks: NavLink[] = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { 
      name: 'PRODUCTS', 
      path: '/products', 
      isDropdown: true,
      dropdownItems: productDropdownItems
    },
    { name: 'BLOG', path: '/blog' },
    { name: 'CONTACT', path: '/contact' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://space-static.coze.site/coze_space/7592923312365764914/upload/cropped-Tinshine-Logo_2328x983.png?sign=1770462906-0c09bcf3e0-0-e8eba198b60ebe81072747a1ce598e4f671bee20e04ad080c73009b981ed04f3" 
                alt="TinShine Logo" 
                className="h-10 w-auto" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
               link.isDropdown ? (
                <div 
                  key={link.path} 
                  className="relative group"
                  onMouseEnter={() => setHoveredDropdown(link.name)}
                  onMouseLeave={() => setHoveredDropdown(null)}
                >
                  <div className="flex items-center">
                    <Link 
                      to={link.path} 
                      className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
                    >
                      {link.name}
                      <i className="fas fa-chevron-down ml-1 text-xs transition-transform duration-300"></i>
                    </Link>
                  </div>
                  
                  <AnimatePresence>
                    {hoveredDropdown === link.name && link.dropdownItems && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50"
                      >
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <i className="fas fa-moon"></i>
              ) : (
                <i className="fas fa-sun"></i>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                link.isDropdown ? (
                   <div key={link.path}>
                      <div className="flex items-center justify-between w-full py-2">
                        <Link
                          to={link.path}
                          className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>{link.name}</span>
                        </Link>
                        <button
                          className="text-gray-700 dark:text-gray-200 focus:outline-none"
                          onClick={() => setHoveredDropdown(hoveredDropdown === link.name ? null : link.name)}
                        >
                          <i className={`fas fa-chevron-down transition-transform duration-300 ${hoveredDropdown === link.name ? 'transform rotate-180' : ''}`}></i>
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {hoveredDropdown === link.name && link.dropdownItems && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200 dark:border-gray-700"
                          >
                            {link.dropdownItems.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                onClick={() => {
                                  setHoveredDropdown(null);
                                  setIsMenuOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}