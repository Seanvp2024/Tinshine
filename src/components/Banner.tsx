import React from 'react';
import { motion } from 'framer-motion';
import { imageDb } from '@/lib/productData';

interface BannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageId?: number; // 使用图片ID代替直接的URL
  reverse?: boolean;
}

export default function Banner({ 
  title, 
  subtitle, 
  buttonText, 
  buttonLink, 
  imageId, // 新增的图片ID属性
  reverse = false 
}: BannerProps) {
  // 从"数据库"获取图片URL，如果没有提供ID则使用传入的URL
  // 注意：这里为了兼容现有代码，保留了URL作为备用选项
  const getImageUrl = (id?: number): string => {
    if (id && imageDb.productImages[id]) {
      return imageDb.productImages[id];
    }
    // 对于未指定ID的情况，使用默认图片
    return imageDb.defaultImage;
  };

  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden shadow-lg mb-16 border border-blue-100 dark:border-gray-700`}>
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <motion.h2 
          initial={{ x: reverse ? 50 : -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ x: reverse ? 50 : -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 dark:text-gray-300 mb-8"
        >
          {subtitle}
        </motion.p>
        <motion.a
          initial={{ x: reverse ? 50 : -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          href={buttonLink}
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 w-fit"
        >
          {buttonText}
        </motion.a>
      </div>
      <div className="md:w-1/2 relative">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={getImageUrl(imageId)} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}