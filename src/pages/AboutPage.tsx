import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import FeatureCard from '@/components/FeatureCard';
import { motion } from 'framer-motion';
import { imageDb } from '@/lib/productData';

export default function AboutPage() {
  // 初始化关于页面的图片到"数据库"
  useEffect(() => {
    // 添加关于页面的图片到"数据库"
    if (!imageDb.productImages[2001]) {
      imageDb.productImages[2001] = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Tin%20can%20manufacturing%20factory%20interior%20modern%20equipment&sign=16f85db784257c243df9db017f74dc3d";
    }
    
    if (!imageDb.productImages[2002]) {imageDb.productImages[2002] = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Tin%20can%20production%20line%20modern%20factory&sign=76812cb5dd39dc4ff47ab8b3b30fa64c";
    }
    
    if (!imageDb.productImages[2003]) {
      imageDb.productImages[2003] = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Quality%20control%20lab%20for%20tin%20products&sign=79f427f9de151e325ee878c070d93108";
    }
    
    if (!imageDb.productImages[2004]) {
      imageDb.productImages[2004] = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Warehouse%20for%20tin%20products%20organized%20storage&sign=ad25a60ef75e98a7af7fc2feed3f1297";
    }
  }, []);

  // 公司特性
  const features = [
    {
      icon: "fa-certificate",
      title: "Quality Assurance",
      description: "We maintain the highest standards of quality in every product we manufacture"
    },
    {
      icon: "fa-industry",
      title: "Advanced Manufacturing",
      description: "Our state-of-the-art facilities ensure precision and efficiency"
    },
    {
      icon: "fa-recycle",
      title: "Eco-Friendly",
      description: "Committed to sustainable practices and materials in all our operations"
    },
    {
      icon: "fa-globe",
      title: "Global Presence",
      description: "Serving clients across the world with our premium tin packaging solutions"
    }
  ];

  // 团队成员
  const teamMembers = [
    {
      name: "John Smith",
      position: "CEO",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Professional%20business%20man%20CEO%20confident%20portrait&sign=17bf79fcd820f1aa9e254cfaab9fe4b8"
    },
    {
      name: "Sarah Johnson",
      position: "Design Director",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Creative%20designer%20woman%20smiling%20portrait&sign=558d8a7047518b8777d1be9121203d89"
    },
    {
      name: "Michael Chen",
      position: "Production Manager",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Factory%20manager%20professional%20portrait&sign=7e8b33dfeeb4063107545f61f1effbdf"
    },
    {
      name: "Emily Wong",
      position: "Marketing Director",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Marketing%20professional%20woman%20confident%20portrait&sign=3af957c748d053edfab92a56bde8889b"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-72 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              About TinShine
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl"
            >
              Leading manufacturer of high-quality tin packaging solutions since 1995
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Company Introduction */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Our Story" 
            subtitle="A journey of excellence in tin manufacturing" 
          />
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
               {/* 从数据库中获取图片或使用默认图片 */}
               <img 
                 src={imageDb.productImages[2001] || imageDb.defaultImage} 
                 alt="Our Factory" 
                 className="rounded-lg shadow-xl w-full h-auto object-cover"
               />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <h3 className="text-2xl font-bold mb-4">A Legacy of Quality</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Founded in 1995, TinShine has grown from a small family business to a leading global manufacturer of tin packaging solutions. With over 25 years of experience, we have perfected the art of creating high-quality, durable, and aesthetically pleasing tin containers.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our commitment to excellence and customer satisfaction has allowed us to serve clients across various industries including food and beverage, cosmetics, household goods, and more. We pride ourselves on our ability to combine traditional craftsmanship with modern technology to create products that exceed expectations.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Today, TinShine operates state-of-the-art facilities with advanced manufacturing equipment and a dedicated team of professionals who are passionate about delivering the best possible products and services to our customers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Our Mission & Vision" 
            subtitle="Guiding principles that drive our business" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <i className="fas fa-bullseye text-blue-600 dark:text-blue-400 mr-3"></i>
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                To provide high-quality, innovative, and sustainable tin packaging solutions that meet the evolving needs of our customers while maintaining the highest standards of ethical business practices and environmental responsibility.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <i className="fas fa-eye text-indigo-600 dark:text-indigo-400 mr-3"></i>
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                To be the global leader in tin packaging solutions, recognized for our innovation, quality, and commitment to sustainability, while building long-term partnerships with our customers and contributing positively to the communities we serve.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Features */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Us" 
            subtitle="The advantages of partnering with TinShine" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Our Team" 
            subtitle="Meet the people behind our success" 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{member.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Factory Tour */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Our Facilities" 
            subtitle="State-of-the-art manufacturing capabilities" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
               <img 
                 src={imageDb.productImages[2002] || imageDb.defaultImage} 
                 alt="Production Line" 
                 className="w-full h-60 object-cover"
               />
              <div className="p-4">
                <h4 className="font-bold">Advanced Production Lines</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">High-speed manufacturing equipment for efficient production</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
               <img 
                 src={imageDb.productImages[2003] || imageDb.defaultImage} 
                 alt="Quality Control" 
                 className="w-full h-60 object-cover"
               />
              <div className="p-4">
                <h4 className="font-bold">Quality Control Lab</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Rigorous testing to ensure every product meets our high standards</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
               <img 
                 src={imageDb.productImages[2004] || imageDb.defaultImage} 
                 alt="Warehouse" 
                 className="w-full h-60 object-cover"
               />
              <div className="p-4">
                <h4 className="font-bold">Modern Warehouse</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Spacious and organized storage facilities for efficient logistics</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}