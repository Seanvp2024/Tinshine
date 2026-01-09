import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatNumber } from '@/lib/utils';
import { getProductsByCategory } from '@/lib/productData';

interface CategoryCardProps {
  id: number;
  name: string;
  icon: string;
  count: number;
  imageUrl: string;
}

export default function CategoryCard({ id, name, icon, count, imageUrl }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative"
    >
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3"
          >
            <i className={`fas ${icon} text-2xl`}></i>
          </motion.div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      {/* 使用实时计算的产品数量，而不是静态值 */}
      <p className="text-white/80 text-sm">{formatNumber(getProductsByCategory(name).length)} Products</p>
        </div>
      </div>
      <Link 
        to={`/category/${id}`}
        className="absolute inset-0"
        aria-label={`View ${name} category`}
      />
    </motion.div>
  );
}