import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { imageDb } from '@/lib/productData';

interface CarouselItem {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
}

// 为轮播图创建特殊的图片ID并添加到"数据库"中
// 注意：实际项目中这些可能来自专门的轮播图库
const carouselImageIds = {
  1: 1001,
  2: 1002,
  3: 1003
};

// 添加轮播图图片到"数据库"
const addCarouselImagesToDb = () => {
  // 如果数据库中还没有这些图片，则添加它们
  if (!imageDb.productImages[carouselImageIds[1]]) {
    imageDb.productImages[carouselImageIds[1]] = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Tin%20can%20packaging%20factory%20modern%20equipment%20production%20line&sign=947ccfb12838abe5f0d41ee67f040e65";
  }
  
  if (!imageDb.productImages[carouselImageIds[2]]) {
    imageDb.productImages[carouselImageIds[2]] = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Custom%20tin%20box%20design%20with%20logo%20various%20shapes&sign=dd3e0dd4abb148a2df027d4ae2b10196";
  }
  
  if (!imageDb.productImages[carouselImageIds[3]]) {
    imageDb.productImages[carouselImageIds[3]] = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Recyclable%20tin%20packaging%20environmental%20sustainability%20concept&sign=a039b450ab958a4b90fc0e720c219b3e";
  }
};

// 初始化轮播图图片
  // 初始化轮播图图片
  addCarouselImagesToDb();

  // 轮播图项目数据
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      title: "Premium Tin Packaging Solutions",
      subtitle: "High-quality tin cans for food, cosmetics, gifts and industrial use",
      buttonText: "Explore Products",
      buttonLink: "/products",
      imageUrl: imageDb.productImages[carouselImageIds[1]] || imageDb.defaultImage
    },
    {
      id: 2,
      title: "Custom Tin Packaging",
      subtitle: "Tailor-made solutions to meet your specific packaging needs",
      buttonText: "Custom Design",
      buttonLink: "/contact",
      imageUrl: imageDb.productImages[carouselImageIds[2]] || imageDb.defaultImage
    },
    {
      id: 3,
      title: "Sustainable Packaging",
      subtitle: "Eco-friendly tin packaging that's recyclable and durable",
      buttonText: "Learn More",
      buttonLink: "/about",
      imageUrl: imageDb.productImages[carouselImageIds[3]] || imageDb.defaultImage
    }
  ];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${carouselItems[currentSlide].imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-lg">
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                  >
                    {carouselItems[currentSlide].title}
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-2xl text-white mb-8"
                  >
                    {carouselItems[currentSlide].subtitle}
                  </motion.p>
                  <motion.a
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    href={carouselItems[currentSlide].buttonLink}
                    className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {carouselItems[currentSlide].buttonText}
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white w-10' 
                : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}