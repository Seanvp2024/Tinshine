import React, { useState, useEffect } from 'react';
  import Navbar from '@/components/Navbar';
  import Footer from '@/components/Footer';
  import SectionHeader from '@/components/SectionHeader';
  import { motion } from 'framer-motion';
  import { Link } from 'react-router-dom';
  import { calculateReadTime, storage } from '@/lib/utils';
  import { imageDb } from '@/lib/productData';
  import { db, blogDb } from '@/services/dbService';

// 博客文章类型定义
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: number;
  likes: number;
}

  // 为了演示分页效果，生成更多博客文章
  const generateBlogPosts = (): BlogPost[] => {
  
  // 初始化博客文章的图片到"数据库"
  // 博客文章的默认图片ID范围
  const blogImageIdBase = 3000;
  
  // 博客文章作者头像的默认图片ID范围
  const authorImageIdBase = 4000;
  
  // 添加博客文章的默认图片到"数据库"
  if (!imageDb.productImages[blogImageIdBase]) {
    imageDb.productImages[blogImageIdBase] = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337";
  }
  
  // 添加作者头像到"数据库"
  if (!imageDb.productImages[authorImageIdBase]) {
    imageDb.productImages[authorImageIdBase] = "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Business%20woman%20writer%20portrait&sign=1d7595363a5707ab712f32e91274da45";
  }
  
  if (!imageDb.productImages[authorImageIdBase + 1]) {
    imageDb.productImages[authorImageIdBase + 1] = "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Environmental%20specialist%20man%20portrait&sign=649f926994ba9a70f933c96ec8f5b9f3";
  }
  
  if (!imageDb.productImages[authorImageIdBase + 2]) {
    imageDb.productImages[authorImageIdBase + 2] = "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Creative%20designer%20woman%20portrait&sign=10e56b077d37c5cc857043c225af2bc7";
  }
  
  if (!imageDb.productImages[authorImageIdBase + 3]) {
    imageDb.productImages[authorImageIdBase + 3] = "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Food%20industry%20expert%20man%20portrait&sign=c9b44ef00a03b0799972a63aee68b6ba";
  }
  
  if (!imageDb.productImages[authorImageIdBase + 4]) {
    imageDb.productImages[authorImageIdBase + 4] = "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Marketing%20specialist%20woman%20portrait&sign=193c83e9568fd6c6c04098b4e0a21afb";
  }
  
  if (!imageDb.productImages[authorImageIdBase + 5]) {
    imageDb.productImages[authorImageIdBase + 5] = "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Engineer%20man%20in%20factory%20portrait&sign=620d16e3512621a7c858182ec47ccc65";
  }
  
  // 获取本地存储中的博客文章
  const savedBlogs = storage.get<BlogPost[]>('blogPosts') || [];
  
  // 博客文章的默认图片ID
  const blogImageId = 3000;
  
  // 作者头像的默认图片ID
  const authorImageIds = {
    "Emily Wong": 4000,
    "Michael Chen": 4001,
    "Sarah Johnson": 4002,
    "John Smith": 4003
  };
  
  const basePosts: BlogPost[] = [
    {
      id: 1,
      title: "TinShine Announces New Sustainable Packaging Initiative",
      excerpt: "Our company is proud to introduce a new line of eco-friendly tin packaging solutions aimed at reducing environmental impact.",
      content: "TinShine is excited to announce our latest sustainability initiative, which includes the development of fully recyclable tin packaging and a commitment to reducing our carbon footprint...",
      imageUrl: imageDb.productImages[blogImageId] || imageDb.defaultImage,
      category: "Company News",
      author: "Emily Wong",
      authorImage: imageDb.productImages[authorImageIds["Emily Wong"]] || imageDb.defaultImage,
      date: "May 15, 2023",
      readTime: 5,
      likes: 124
    },
  {
    id: 2,
    title: "TinShine Wins 'Best Packaging Manufacturer' Award",
    excerpt: "We are honored to receive this prestigious industry recognition for our innovation and quality in tin packaging solutions.",
    content: "TinShine has been awarded the 'Best Packaging Manufacturer' title at the annual Packaging Excellence Awards, recognizing our commitment to quality, innovation, and customer satisfaction...",
    imageUrl: imageDb.productImages[blogImageId] || imageDb.defaultImage,
    category: "Company News",
    author: "Michael Chen",
    authorImage: imageDb.productImages[authorImageIds["Michael Chen"]] || imageDb.defaultImage,
    date: "June 3, 2023",
    readTime: 4,
    likes: 98
  },
  {
    id: 3,
    title: "Expansion of Our Manufacturing Facility Completed",
    excerpt: "TinShine has successfully expanded its production capabilities with a new state-of-the-art manufacturing facility.",
    content: "We are pleased to announce the completion of our manufacturing facility expansion, which will allow us to double our production capacity and introduce new advanced tin manufacturing technologies...",
    imageUrl: imageDb.productImages[blogImageId] || imageDb.defaultImage,
    category: "Company News",
    author: "Sarah Johnson",
    authorImage: imageDb.productImages[authorImageIds["Sarah Johnson"]] || imageDb.defaultImage,
    date: "June 20, 2023",
    readTime: 6,
    likes: 156
  },
  {
    id: 4,
    title: "Global Tin Packaging Market Trends for 2023",
    excerpt: "An in-depth analysis of the latest trends shaping the global tin packaging industry and what they mean for businesses.",
    content: "The global tin packaging market is experiencing significant changes driven by consumer preferences, technological advancements, and sustainability concerns. This article examines the key trends influencing the industry...",
    imageUrl: imageDb.productImages[blogImageId] || imageDb.defaultImage,
    category: "Industry News",
    author: "John Smith",
    authorImage: imageDb.productImages[authorImageIds["John Smith"]] || imageDb.defaultImage,
    date: "July 8, 2023",
    readTime: 8,
    likes: 112
  },
  {
    id: 5,
    title: "How Digital Printing is Revolutionizing Tin Packaging",
    excerpt: "Digital printing technology is transforming the tin packaging industry, enabling more customization and shorter production runs.",
    content: "Digital printing has emerged as a game-changer in the tin packaging sector, allowing for greater design flexibility, faster turnaround times, and cost-effective short runs. This article explores the impact of this technology...",
    imageUrl: imageDb.productImages[blogImageId] || imageDb.defaultImage,
    category: "Industry News",
    author: "Emily Wong",
    authorImage: imageDb.productImages[authorImageIds["Emily Wong"]] || imageDb.defaultImage,
    date: "July 25, 2023",
    readTime: 7,
    likes: 132
  },
  {
    id: 6,
    title: "Consumer Preferences Shifting Toward Sustainable Packaging",
    excerpt: "Recent market research reveals growing consumer demand for environmentally friendly packaging solutions.",
    content: "A new industry report highlights a significant shift in consumer preferences toward sustainable packaging options, with tin packaging emerging as a popular choice due to its recyclability and durability...",
    imageUrl: imageDb.productImages[blogImageId] || imageDb.defaultImage,
    category: "Industry News",
    author: "Michael Chen",
    authorImage: imageDb.productImages[authorImageIds["Michael Chen"]] || imageDb.defaultImage,
    date: "August 10, 2023",
    readTime: 6,
    likes: 87
  }
];
  
  // 添加更多文章以展示分页效果
  const additionalPosts: BlogPost[] = Array.from({ length: 12 }, (_, index) => {
    const id = index + 7;
    const categories = ["Company News", "Industry News"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const authors = ["Emily Wong", "Michael Chen", "Sarah Johnson", "John Smith"];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    
    return {
      id,
      title: `${randomCategory === "Company News" ? "Company Update: " : "Industry Insight: "}${id % 3 === 0 ? "New Technologies" : id % 3 === 1 ? "Sustainability Practices" : "Market Analysis"} in Tin Packaging ${id}`,
      excerpt: `This article discusses the latest developments in ${randomCategory.toLowerCase()}, focusing on innovative approaches and future trends in the tin packaging industry.`,
      content: `Detailed content about ${randomCategory.toLowerCase()} and its impact on the tin packaging market...`,
      imageUrl: imageDb.productImages[blogImageId] || imageDb.defaultImage,
      category: randomCategory,
      author: randomAuthor,
      authorImage: `https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Professional%20writer%20${randomAuthor.includes("Sarah") || randomAuthor.includes("Emily") ? "woman" : "man"}%20portrait&sign=1182c444aa1e43c7b7728010cdb8e39d`,
                   date: `August ${15 + id % 15}, 2023`,
                   readTime: calculateReadTime(`Detailed content about ${randomCategory.toLowerCase()} and its impact on the tin packaging market...`),
                  likes: 80 + id * 5
                };
  });
  
  return [...basePosts, ...additionalPosts];
};

  // Blog post data
  // 注意：为了确保每次访问页面都能获取最新数据，我们在组件内部调用getBlogPosts()
  
  // Blog post data
// 注意：为了确保每次访问页面都能获取最新数据，我们在组件内部调用getBlogPosts()

// Blog categories
const categories = [
  "All",
  "Company News",
  "Industry News"
];

// 为了防止循环导入，从LoginPage导入PublicDataSyncIndicator
// 实际使用中，建议将此组件移到共享组件目录

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 从服务器获取博客数据
  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const allBlogs = await blogDb.fetchAll();
      
      // 过滤和排序博客文章
      let filteredBlogs = [];
      
      if (selectedCategory === "All") {
        filteredBlogs = allBlogs;
      } else {
        filteredBlogs = allBlogs.filter(post => post.category === selectedCategory);
      }
      
      // 按日期排序（最新的在前）
      setBlogPosts(filteredBlogs.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      }));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // 使用本地存储的默认数据
      const defaultBlogs = generateBlogPosts();
      setBlogPosts(defaultBlogs);
    } finally {
      setIsLoading(false);
    }
  };
  
   // 当筛选条件改变时重新获取数据
  useEffect(() => {
    fetchBlogPosts();
  }, [selectedCategory]);
  
  // 添加数据更新监听，确保后台修改后能及时刷新博客列表
  useEffect(() => {
    const handleDataUpdate = () => {
      // 重新从服务器获取数据
      fetchBlogPosts();
      
      // 重新加载图片数据库，确保获取最新的图片URL
      db.loadImageDb();
    };
    
    // 使用dbService提供的更完善的事件监听
    const unsubscribe = db.onDataUpdate(handleDataUpdate);
    
    return () => {
      unsubscribe();
    };
  }, [selectedCategory]);
  
  // 同步数据按钮处理函数
  const handleSyncData = async () => {
    await db.syncAllData();
    // 重新获取数据
    fetchBlogPosts();
  };
  
  // 计算当前页显示的文章
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // 计算总页数
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  
  // 处理页面变更
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 渲染分页按钮
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex justify-center mt-12">
        <nav aria-label="Page navigation">
          <ul className="inline-flex rounded-md shadow-md overflow-hidden">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-3 border border-gray-300 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                  currentPage === 1 ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
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
                  className={`px-4 py-3 border-t border-b border-gray-300 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600 transition-all duration-300 ${
                    currentPage === number
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
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
                className={`px-4 py-3 border border-gray-300 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                  currentPage === totalPages ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
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
  
  // 当选择新的分类时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);
  
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
              Our Blog
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl"
            >
              Insights, news, and trends in the world of tin packaging
            </motion.p>
          </div>
        </div>
      </section>
      
       {/* Blog Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="mb-8">
            {/* Category Selector */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              {categories.map((category) => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {isLoading ? (
                // 显示加载骨架屏
                Array.from({ length: 9 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
                      <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700"></div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : currentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Link 
                    to={`/blog/${post.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{post.category}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
           
          {/* Empty State */}
          {!isLoading && blogPosts.length === 0 && (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">No blog posts found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or category filter
              </p>
                <button 
                  onClick={() => {
                    setSelectedCategory("All");
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  View All
                </button>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}