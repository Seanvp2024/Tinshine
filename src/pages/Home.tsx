import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Carousel from "@/components/Carousel";
import Banner from "@/components/Banner";
import SectionHeader from "@/components/SectionHeader";
import FeatureCard from "@/components/FeatureCard";
import CategoryCard from "@/components/CategoryCard";
import { motion } from "framer-motion";
import { productCategories, getFeaturedProducts, getNewProducts } from "@/lib/productData";

const features = [{
    icon: "fa-certificate",
    title: "Quality Assurance",
    description: "We maintain the highest standards of quality in every product we manufacture"
}, {
    icon: "fa-industry",
    title: "Advanced Manufacturing",
    description: "Our state-of-the-art facilities ensure precision and efficiency"
}, {
    icon: "fa-recycle",
    title: "Eco-Friendly",
    description: "Committed to sustainable practices and materials in all our operations"
}, {
    icon: "fa-globe",
    title: "Global Presence",
    description: "Serving clients across the world with our premium tin packaging solutions"
}];

import { PublicDataSyncIndicator } from './LoginPage';

export default function Home() {
    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <Navbar />
            {}
            <Carousel />
            {}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title="Our Product Categories"
                        subtitle="Explore our wide range of tin packaging solutions"
                        buttonText="View All Products"
                        buttonLink="/products" />
                    <motion.div
                        initial={{
                            opacity: 0
                        }}
                        whileInView={{
                            opacity: 1
                        }}
                        viewport={{
                            once: true
                        }}
                        transition={{
                            duration: 0.5
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {productCategories.slice(0, 4).map(category => <CategoryCard
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            icon={category.icon}
                            count={category.count}
                            imageUrl={category.imageUrl} />)}
                    </motion.div>
                    <div className="mt-8 text-center">
                        <></>
                    </div>
                </div>
            </section>
            {}
            <section className="py-16">
                <div className="container mx-auto px-4">
             <Banner
                 title="Premium Tin Packaging Solutions"
                 subtitle="High-quality, durable, and customizable tin containers for all your packaging needs. Trusted by businesses worldwide since 1995."
                 buttonText="Learn More About Us"
                 buttonLink="/about"
                 imageId={1004} />
             </div>
            </section>
            {}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title="Why Choose TinShine"
                        subtitle="The advantages of partnering with us for your packaging needs" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                y: 30
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1
                            }}>
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description} />
                        </motion.div>)}
                    </div>
                </div>
            </section>
            {}
            <section className="py-16">
                <div className="container mx-auto px-4">
                 <Banner
                     title="Custom Tin Solutions"
                     subtitle="Tailor-made packaging solutions designed specifically for your products and brand. Our team of experts will work with you to create the perfect design."
                     buttonText="Request a Custom Quote"
                     buttonLink="/contact"
                     imageId={1005}
                     reverse={true} />
                 </div>
            </section>
            {}
            <section className="py-16 bg-blue-50 dark:bg-blue-900/20">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title="What Our Clients Say"
                        subtitle="Testimonials from businesses that trust our tin packaging solutions" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5
                            }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">"TinShine has been our trusted packaging partner for over 5 years. Their attention to detail and commitment to quality is unmatched in the industry."
                                              </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Business%20woman%20CEO%20smiling%20portrait&sign=acbe8cf46a8337b710930f8c7789466b"
                                        alt="Client"
                                        className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Sarah Johnson</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">CEO, Gourmet Delights</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.1
                            }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">"The custom tin packaging from TinShine has significantly enhanced our product presentation and customer perception. Their service is excellent."
                                              </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Business%20man%20manager%20confident%20portrait&sign=4ae1e7d0d5565b642bfe1e21d4285be0"
                                        alt="Client"
                                        className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Michael Chen</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Marketing Director, Fine Teas</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2
                            }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">"We were impressed by the speed and efficiency of TinShine's production process. They delivered our order ahead of schedule without compromising quality."
                                              </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Business%20owner%20woman%20smiling%20portrait&sign=f507778d44ea6bc67ba2998b744fe5d5"
                                        alt="Client"
                                        className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Emily Wong</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Founder, Artisan Cosmetics</p>
                                </div>
                            </div>
                        </motion.div>
           </div>
         </div>
       </section>
       <Footer />
     </div>
   );
}