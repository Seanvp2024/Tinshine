import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ProductCard from '@/components/ProductCard';
import { householdGoodsTinProducts } from '@/lib/productData';

export default function HouseholdGoodsTinPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  // 计算当前页显示的产品
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = householdGoodsTinProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // 计算总页数
  const totalPages = Math.ceil(householdGoodsTinProducts.length / productsPerPage);
  
  // 处理页面变更
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 渲染分页按钮
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex justify-center mt-12">
        <nav aria-label="Page navigation">
          <ul className="inline-flex rounded-md shadow">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentPage === 1 ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>
            
            {pageNumbers.map((number) => (
              <li key={number}>
                <button
                  onClick={() => handlePageChange(number)}
                  className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600 ${
                    currentPage === number
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
            
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentPage === totalPages ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-72 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Household Goods Tin</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Durable and practical tin containers for organizing and storing various household items.
            </p>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Household Goods Tins" 
            subtitle="Versatile storage solutions for your home organization needs" 
            align="left"
          />
          
          {/* Products Grid - 3 columns layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {currentProducts.map((product) => (
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
          
          {/* Pagination */}
          {renderPagination()}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}