import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  buttonText?: string;
  buttonLink?: string;
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  align = 'center', 
  buttonText, 
  buttonLink 
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row items-${align} justify-between mb-8`}>
      <div className="text-center md:text-left mb-4 md:mb-0">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-2"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 max-w-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {buttonText && buttonLink && (
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          href={buttonLink}
          className="inline-flex items-center px-6 py-2 border border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors duration-300"
        >
          {buttonText}
          <i className="fas fa-arrow-right ml-2 text-sm"></i>
        </motion.a>
      )}
    </div>
  );
}