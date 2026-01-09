import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { db } from '@/services/dbService';

interface ProductProps {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  description?: string;
}

export default function ProductCard({ id, name, imageUrl, category, description }: ProductProps) {  
  // 确保每个产品的图片、标题和介绍都是一一对应的
  return (
    <motion.div
      key={id}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <div className="flex justify-center">
            <Link 
              to={`/product/${id}`}
              className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
            >
              <i className="fas fa-eye mr-1"></i> View Details
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{category}</div>
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}