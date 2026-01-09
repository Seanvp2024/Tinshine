import React, { useEffect, useState } from 'react';
  import Navbar from '@/components/Navbar';
  import Footer from '@/components/Footer';
  import { useParams, useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { calculateReadTime, storage } from '@/lib/utils';
  import { imageDb } from '@/lib/productData';
  import { db } from '@/services/dbService';

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

  // 博客文章数据生成函数
  const generateBlogPost = (id: number): BlogPost => {
    // 根据ID生成不同的博客文章内容
    const categories = ["Company News", "Industry News"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const authors = ["Emily Wong", "Michael Chen", "Sarah Johnson", "John Smith"];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    
    // 根据ID生成不同的标题和内容
    let title = '';
    let content = '';
    
    if (id <= 6) {
      // 保留原始的6篇博客文章内容
      switch (id) {
        case 1:
          title = "TinShine Announces New Sustainable Packaging Initiative";
          content = "TinShine is excited to announce our latest sustainability initiative, which includes the development of fully recyclable tin packaging and a commitment to reducing our carbon footprint.\n\nOur new eco-friendly line of tin containers is designed to be 100% recyclable while maintaining the durability and aesthetic appeal that our customers have come to expect. This initiative aligns with our corporate values of environmental stewardship and social responsibility.\n\n\"We believe that businesses have a responsibility to minimize their environmental impact,\" said John Smith, CEO of TinShine. \"This new line of sustainable packaging is just one of the ways we're working to create a more sustainable future for our industry.\"\n\nIn addition to developing recyclable packaging, TinShine is also implementing energy-efficient manufacturing processes and reducing waste throughout our supply chain. We're committed to continuing our research and development efforts to find even more innovative ways to make our products and processes more sustainable.\n\nFor more information about our sustainable packaging solutions or to learn how your business can reduce its environmental impact, please contact our sales team.";
          break;
        case 2:
          title = "TinShine Wins 'Best Packaging Manufacturer' Award";
          content = "TinShine has been awarded the 'Best Packaging Manufacturer' title at the annual Packaging Excellence Awards, recognizing our commitment to quality, innovation, and customer satisfaction.\n\nThe Packaging Excellence Awards are among the most prestigious honors in the packaging industry, with winners selected by a panel of independent experts based on criteria including product quality, innovation, sustainability, and customer service.\n\n\"We're incredibly honored to receive this recognition,\" said Sarah Johnson, Design Director at TinShine. \"It's a testament to the hard work and dedication of our entire team, from our design and manufacturing teams to our customer service representatives.\"\n\nTinShine was recognized for its innovative approach to tin packaging design, its commitment to sustainable manufacturing practices, and its ability to consistently deliver high-quality products that meet the evolving needs of its customers.\n\nThis is the third consecutive year that TinShine has been recognized at the Packaging Excellence Awards, demonstrating the company's ongoing commitment to excellence in all aspects of its business.\n\nTo learn more about our award-winning packaging solutions, please visit our Products page or contact our sales team.";
          break;
        case 3:
          title = "Expansion of Our Manufacturing Facility Completed";
          content = "We are pleased to announce the completion of our manufacturing facility expansion, which will allow us to double our production capacity and introduce new advanced tin manufacturing technologies.\n\nThe expansion includes a 50,000 square foot addition to our existing facility, as well as the installation of state-of-the-art manufacturing equipment that will enable us to produce tin containers more efficiently and with greater precision than ever before.\n\n\"This expansion represents a significant investment in our future and our ability to serve our customers,\" said Michael Chen, Production Manager at TinShine. \"With our increased capacity and advanced technology, we'll be able to take on larger orders and provide even more customized solutions to meet our customers' unique packaging needs.\"\n\nThe new equipment includes automated production lines, precision welding machines, and advanced quality control systems that will help ensure that every product meets TinShine's rigorous quality standards.\n\nThe expansion also includes improvements to our employee facilities, including a new break room, training center, and safety equipment. These improvements reflect TinShine's commitment to creating a safe, comfortable, and supportive work environment for its employees.\n\nThe project was completed on time and within budget, thanks to the hard work and dedication of our construction team and the cooperation of our employees throughout the expansion process.";
          break;
        case 4:
          title = "Global Tin Packaging Market Trends for 2023";
          content = "The global tin packaging market is experiencing significant changes driven by consumer preferences, technological advancements, and sustainability concerns. This article examines the key trends influencing the industry in 2023.\n\n1. Sustainability Takes Center Stage\n\nConsumers are increasingly demanding sustainable packaging solutions, and tin packaging is well-positioned to meet this demand. Tin is one of the most recyclable materials available, with a recycling rate of over 90% in many countries. As a result, we're seeing growing interest in tin packaging from companies looking to reduce their environmental impact.\n\n2. Customization and Personalization\n\nAdvances in digital printing technology are making it easier and more cost-effective to create customized tin packaging. This trend is being driven by the desire to create unique brand experiences and connect with consumers on a more personal level.\n\n3. Premiumization\n\nAs consumers become more willing to pay for high-quality products, there's growing demand for premium packaging solutions that reflect the quality of the products they contain. Tin packaging's durability, aesthetic appeal, and ability to protect products make it an ideal choice for premium brands.\n\n4. Convenience Features\n\nConsumers are looking for packaging that offers convenience features such as easy opening, resealability, and portability. Tin packaging manufacturers are responding with innovative designs that meet these needs while maintaining the material's inherent benefits.\n\n5. Technological Advancements\n\nNew manufacturing technologies are making it possible to create tin packaging with greater precision, efficiency, and design flexibility than ever before. These advancements are helping to drive down costs and expand the range of applications for tin packaging.";
          break;
        case 5:
          title = "How Digital Printing is Revolutionizing Tin Packaging";
          content = "Digital printing has emerged as a game-changer in the tin packaging sector, allowing for greater design flexibility, faster turnaround times, and cost-effective short runs. This article explores the impact of this technology on the industry.\n\nTraditional printing methods for tin packaging, such as offset printing, have long been the standard. However, these methods come with significant limitations, including high setup costs, long lead times, and limited design flexibility. Digital printing is overcoming these limitations and transforming the way tin packaging is designed and produced.\n\nOne of the most significant advantages of digital printing is its ability to produce high-quality, full-color designs without the need for expensive printing plates. This makes it ideal for short runs and customized packaging solutions that would be cost-prohibitive with traditional printing methods.\n\nDigital printing also offers faster turnaround times, allowing companies to respond more quickly to market trends and customer demands. This agility is becoming increasingly important in today's fast-paced business environment.\n\nAnother benefit of digital printing is its ability to incorporate variable data printing, which allows each tin to be printed with unique information or designs. This opens up new possibilities for personalized packaging, limited edition products, and targeted marketing campaigns.\n\nAt TinShine, we've embraced digital printing technology and incorporated it into our manufacturing processes. This allows us to offer our customers greater design flexibility, faster turnaround times, and more cost-effective solutions for short-run and customized packaging needs.\n\nAs digital printing technology continues to evolve, we can expect to see even more innovations in tin packaging design and production.";
          break;
        case 6:
          title = "Consumer Preferences Shifting Toward Sustainable Packaging";
          content = "A new industry report highlights a significant shift in consumer preferences toward sustainable packaging options, with tin packaging emerging as a popular choice due to its recyclability and durability.\n\nThe report, conducted by a leading market research firm, surveyed over 10,000 consumers across 10 countries to understand their attitudes and behaviors toward packaging. The results revealed that 78% of consumers consider packaging sustainability when making purchasing decisions, up from 65% just two years ago.\n\nPerhaps most notably, the report found that consumers are willing to pay a premium for products with sustainable packaging. On average, consumers are willing to pay 10-15% more for products packaged in materials that are recyclable, reusable, or biodegradable.\n\nTin packaging scored particularly well in the survey, with 83% of consumers recognizing it as a sustainable packaging option. This is due in part to tin's high recycling rate and its ability to be recycled infinitely without losing quality.\n\n\"These findings confirm what we've been seeing in the market,\" said Emily Wong, Marketing Director at TinShine. \"Consumers are becoming increasingly environmentally conscious, and they're looking for brands that share their values. Tin packaging offers an excellent solution for companies looking to meet this demand while still providing high-quality, durable packaging for their products.\"\n\nThe report also noted that sustainability is no longer just a niche concern but has become a mainstream consumer expectation. As a result, companies that fail to address sustainability in their packaging may find themselves at a competitive disadvantage.\n\nFor companies looking to make the switch to more sustainable packaging, tin offers a number of advantages beyond its environmental benefits, including durability, aesthetic appeal, and versatility.";
          break;
        default:
          title = `${randomCategory === "Company News" ? "Company Update: " : "Industry Insight: "}New Innovations in Tin Packaging`;
          content = "Detailed content about the latest innovations and trends in the tin packaging industry...\n\nThis article explores how new technologies and design approaches are transforming the way tin packaging is used across various industries, from food and beverage to cosmetics and household goods.\n\nAs consumer preferences continue to evolve, manufacturers are developing new solutions to meet the demands for sustainability, convenience, and aesthetic appeal.\n\nWe'll examine case studies of successful packaging innovations and discuss how they've helped brands differentiate themselves in competitive markets.\n\nAdditionally, we'll look at emerging trends that are likely to shape the future of tin packaging and offer insights for businesses looking to stay ahead of the curve.";
      }
    } else {
      // 为额外的22篇博客文章生成内容
      title = `${randomCategory === "Company News" ? "Company Update: " : "Industry Insight: "}${id % 3 === 0 ? "New Technologies" : id % 3 === 1 ? "Sustainability Practices" : "Market Analysis"} in Tin Packaging ${id}`;
      content = `This article discusses the latest developments in ${randomCategory.toLowerCase()}, focusing on innovative approaches and future trends in the tin packaging industry.\n\nThe tin packaging sector is undergoing significant changes driven by evolving consumer preferences, technological advancements, and sustainability concerns. This article explores these trends and their implications for businesses across various industries.\n\nWe'll examine case studies of successful packaging solutions and discuss best practices for companies looking to optimize their packaging strategies.\n\nAdditionally, we'll provide insights into emerging technologies and design approaches that are shaping the future of the industry.\n\nWhether you're a brand owner looking to enhance your product packaging or a manufacturer seeking to stay ahead of the competition, this article offers valuable information to help you make informed decisions about your packaging strategy.`;
    }
    
    return {
      id,
      title,
      excerpt: title === "TinShine Announces New Sustainable Packaging Initiative" 
        ? "Our company is proud to introduce a new line of eco-friendly tin packaging solutions aimed at reducing environmental impact."
        : title === "TinShine Wins 'Best Packaging Manufacturer' Award"
        ? "We are honored to receive this prestigious industry recognition for our innovation and quality in tin packaging solutions."
        : title === "Expansion of Our Manufacturing Facility Completed"
        ? "TinShine has successfully expanded its production capabilities with a new state-of-the-art manufacturing facility."
        : title === "Global Tin Packaging Market Trends for 2023"
        ? "An in-depth analysis of the latest trends shaping the global tin packaging industry and what they mean for businesses."
        : title === "How Digital Printing is Revolutionizing Tin Packaging"
        ? "Digital printing technology is transforming the tin packaging industry, enabling more customization and shorter production runs."
        : title === "Consumer Preferences Shifting Toward Sustainable Packaging"
        ? "Recent market research reveals growing consumer demand for environmentally friendly packaging solutions."
        : `This article discusses the latest developments in ${randomCategory.toLowerCase()}, focusing on innovative approaches and future trends in the tin packaging industry.`,
      content,
        // 从"数据库"获取图片或使用默认图片
        imageUrl: imageDb.productImages[3000] || imageDb.defaultImage,
      category: randomCategory,
      author: randomAuthor,
      // 从"数据库"获取作者头像或使用默认图片
      authorImage: imageDb.productImages[4000 + authors.indexOf(randomAuthor)] || imageDb.defaultImage,
      date: id <= 6 
        ? ["May 15, 2023", "June 3, 2023", "June 20, 2023", "July 8, 2023", "July 25, 2023", "August 10, 2023"][id-1] 
        : `August ${15 + id % 15}, 2023`,
      readTime: calculateReadTime(content),
      likes: 80 + id * 5
    };
  };

  // 相关文章类型定义
  interface RelatedPost {
    id: number;
    title: string;
    imageUrl: string;
    date: string;
  }

  // 生成相关文章
  const generateRelatedPosts = (currentPostId: number): RelatedPost[] => {
    const categories = ["Company News", "Industry News"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // 生成3篇相关文章，但避免与当前文章ID重复
    return Array.from({ length: 3 }, (_, index) => {
      let id = currentPostId + index + 1;
      // 如果ID超过28，循环回1
      if (id > 28) id = id - 28;
      // 确保不与当前文章ID重复
      if (id === currentPostId) id = id % 28 + 1;
      
       return {
        id,
        title: `${randomCategory === "Company News" ? "Related: " : "Related Insight: "}${id % 3 === 0 ? "Latest Trends" : id % 3 === 1 ? "Industry Updates" : "Expert Analysis"} in Tin Packaging`,
        // 从"数据库"获取相关文章图片或使用默认图片
        imageUrl: imageDb.productImages[3000] || imageDb.defaultImage,
        date: `August ${20 + id % 10}, 2023`
      };
    });
  };

  export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
// 获取博客文章数据，优先使用数据库中的最新数据
  const fetchPostData = () => {
    const postId = parseInt(id || '1', 10);
    
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      // 首先尝试从数据库中查找文章
      const userBlogs = db.getCollection<BlogPost>('blogPosts');
      const userBlog = userBlogs.find(blog => blog.id === postId);
      
      if (userBlog) {
        // 如果找到用户添加的博客文章，使用它
        setPost(userBlog);
        setRelatedPosts(generateRelatedPosts(postId));
      } else {
        // 否则使用生成的博客文章
        // 确保ID在有效范围内
        const validId = Math.max(1, Math.min(28, postId));
        const blogPost = generateBlogPost(validId);
        const related = generateRelatedPosts(validId);
        
        setPost(blogPost);
        setRelatedPosts(related);
      }
      
      setIsLoading(false);}, 500);
    
    return () => clearTimeout(timer);
  };
  
  // 当ID参数变化时获取对应的博客文章
  useEffect(() => {
    fetchPostData();
    
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);
  
  // 监听数据更新事件，确保后台修改后能及时刷新内容
  useEffect(() => {
    const handleDataUpdate = () => {
      // 无论查看的是哪种博客，都重新获取数据以确保显示最新内容
      fetchPostData();
      
      // 重新加载图片数据库，确保获取最新的图片URL
      db.loadImageDb();
    };
    
    // 使用dbService提供的事件监听
    const unsubscribe = db.onDataUpdate(handleDataUpdate);
    
    return () => unsubscribe();
  }, [id]);
    
    // 将内容中的换行符转换为<br/>标签
    const formatContent = (content: string) => {
      // 处理标题、列表等格式化
      const paragraphs = content.split('\n\n');
      
      return paragraphs.map((paragraph, index) => {
        // 检查是否是标题行（数字+点+空格开头）
        if (/^\d+\.\s+/.test(paragraph)) {
          const [titlePart, ...contentParts] = paragraph.split('\n');
          const title = titlePart.replace(/^\d+\.\s+/, '');
          const content = contentParts.join('\n');
          
          return (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{content}</p>
            </div>
          );
        }
        
        // 检查是否是引用段落
        if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
          return (
            <div key={index} className="mb-6 px-6 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600 italic">
              <p className="text-gray-700 dark:text-gray-300">{paragraph}</p>
            </div>
          );
        }
        
        // 普通段落
        return (
          <p key={index} className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            {paragraph}
          </p>
        );
      });
    };
    
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold">Loading blog post...</h2>
          </div>
        </div>
      );
    }
    
    if (!post) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center">
          <div className="text-center p-8">
            <i className="fas fa-search text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
            <h2 className="text-2xl font-bold mb-2">Blog post not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The requested blog post could not be found.</p>
            <button 
              onClick={() => navigate('/blog')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md"
            >
              Browse All Posts
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Navbar />
        
        {/* Main Content Wrapper */}
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-sm mb-6 text-gray-500 dark:text-gray-400">
            <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a>
            <i className="fas fa-chevron-right mx-2 text-xs"></i>
            <a href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a>
            <i className="fas fa-chevron-right mx-2 text-xs"></i>
            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px] md:max-w-[400px]">{post.title}</span>
          </div>
          
          {/* Blog Content Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Article Content */}
            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              {/* Featured Image */}
              <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Article Header */}
              <div className="p-6 md:p-8">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
                >
                  {post.title}
                </motion.h1>
                
                {/* Article Metadata */}
                <div className="flex flex-wrap items-center justify-between mb-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <i className="far fa-calendar-alt text-gray-500 mr-2"></i>
                      <span className="text-gray-600 dark:text-gray-400">{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="far fa-clock text-gray-500 mr-2"></i>
                      <span className="text-gray-600 dark:text-gray-400">{post.readTime} min read</span>
                    </div>
                    <div className="flex items-center">
                      <i className="far fa-user text-gray-500 mr-2"></i>
                      <span className="text-gray-600 dark:text-gray-400">{post.author}</span>
                    </div>
                  </div>
                </div>
                
                {/* Article Content */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="prose prose-lg dark:prose-invert max-w-none"
                >
                  {formatContent(post.content)}
                </motion.div>
                

              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4">

              
              {/* Related Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Related Articles</h3>
                <div className="space-y-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div 
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex gap-4 group cursor-pointer"
                      onClick={() => navigate(`/blog/${relatedPost.id}`)}
                    >
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img 
                          src={relatedPost.imageUrl} 
                          alt={relatedPost.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{relatedPost.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              

              
              {/* Back to Blog Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <button 
                  onClick={() => navigate('/blog')}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to All Articles
                </button>
              </motion.div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }