import { storage } from "@/lib/utils";
import { db, productDb } from "@/services/dbService";

// 定义"数据库"结构来存储所有图片数据
export interface ImageDatabase {
  productImages: Record<number, string>; // 产品ID映射到图片URL
  categoryImages: Record<number, string>; // 类别ID映射到图片URL
  defaultImage: string; // 默认图片URL
}

// 创建"数据库"实例来存储所有图片数据
export const imageDb: ImageDatabase = {
  // 产品图片数据库
  productImages: {
    1: "https://lf-code-agent.coze.cn/obj/x-ai-cn/320719794690/attachment/87d19e4a-abc1-4554-a378-b55cf3c5056f_20260109170801.jpg",
    // 可以在这里添加更多产品ID和对应的图片URL
    // 例如: 2: "https://example.com/another-image.jpg",
  },
  
  // 类别图片数据库
  categoryImages: {
    1: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
    2: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
    3: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
    4: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
    5: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
    6: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
    7: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
    8: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=solid%20red%20background&sign=56c8367060d42dfcf14056380b129337",
  },
  
  // 默认图片
  defaultImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=solid%20red%20background&sign=975fa253f980fadea83ff085bf52c70b"
};

// 初始化时加载保存的图片数据库
db.loadImageDb();

// 产品类型定义
export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  additionalImages: string[];
  rating: number;
  category: string;
  subCategory?: string;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
    unit: string;
  };
  material?: string;
  capacity?: string;
  color?: string;
  features?: string[];
  applications?: string[];
  minOrderQuantity?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

// 产品类别类型定义
export interface ProductCategory {
  id: number;
  name: string;
  icon: string;
  imageUrl: string;
  description: string;
  count: number;
}

// 从"数据库"获取产品图片的函数
const getProductImageFromDb = (id: number, category: string): string => {
  // 首先检查数据库中是否有特定产品的图片
  if (imageDb.productImages[id]) {
    return imageDb.productImages[id];
  }
  
  // 如果没有特定图片，则生成一个基于ID和类别的图片URL
  // 定义各种纯色
  const solidColors = [
    "red", "blue", "green", "yellow", "purple", "pink", "orange", "teal", 
    "indigo", "cyan", "amber", "emerald", "violet", "fuchsia", "lime", "rose",
    "slate", "zinc", "gold", "silver", "bronze", "navy", "maroon", "olive"
  ];
  
  // 根据产品ID和类别生成更独特的颜色组合
  const categoryNames = [
    "Food Iron Box", "Wine Cans", "Cosmetic Tin", "Tea Coffee Tin", 
    "Household Goods Tin", "Tinplate Can", "Gift Tin", "New Product"
  ];
  
  const categoryIndex = categoryNames.indexOf(category);
  const colorIndex = (id + categoryIndex) % solidColors.length;
  const color = solidColors[colorIndex];
  
  // 为每个产品类别添加特定的提示词
  const categoryPrompts: Record<string, string> = {
    "Food Iron Box": "food packaging container",
    "Wine Cans": "beverage can design",
    "Cosmetic Tin": "elegant beauty container",
    "Tea Coffee Tin": "coffee tea storage",
    "Household Goods Tin": "home storage organizer",
    "Tinplate Can": "industrial metal container",
    "Gift Tin": "luxury gift box",
    "New Product": "innovative packaging design"
  };
  
  const prompt = `solid ${color} background ${categoryPrompts[category] || "tin container"}`;
  // 为确保URL唯一性，添加一个基于ID和类别的参数
  const uniqueParam = (id + categoryIndex).toString(36).substr(2, 8);
  return `https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=${encodeURIComponent(prompt)}&unique=${uniqueParam}`;
};

// 为每个产品类别生成模拟数据，确保每个产品的图片、标题和介绍都是一一对应的
export const generateProducts = (category: string, count: number): Product[] => {
  // 生成随机日期，过去6个月内
  const generateRandomDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 180);
    const randomDate = new Date();
    randomDate.setDate(today.getDate() - randomDays);
    return randomDate.toISOString();
  };

  // 生成随机特性列表
  const generateRandomFeatures = () => {
    const featuresList = [
      "Durable construction",
      "Elegant design",
      "Food-grade material",
      "Recyclable",
      "Stackable",
      "Tamper-proof",
      "Customizable",
      "Airtight seal",
      "UV protected",
      "Environmentally friendly"
    ];
    const shuffled = [...featuresList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 5) + 3);
  };

  // 生成随机应用场景
  const generateRandomApplications = (category: string) => {
    const applicationsMap: Record<string, string[]> = {
      "Food Iron Box": ["Snacks", "Confectionery", "Biscuits", "Candies", "Chocolates", "Cookies", "Nuts", "Dried fruits"],
      "Wine Cans": ["Wine", "Spirits", "Beer", "Cocktails", "Juices", "Energy drinks", "Smoothies"],
      "Cosmetic Tin": ["Skincare products", "Makeup", "Perfumes", "Lip balms", "Candles", "Essential oils", "Bath salts"],
      "Tea Coffee Tin": ["Coffee beans", "Tea leaves", "Powdered drinks", "Herbs", "Spices", "Sugar", "Salt"],
      "Household Goods Tin": ["Candles", "Soaps", "Detergents", "Cleaning supplies", "Storage solutions", "Stationery", "Craft supplies"],
      "Tinplate Can": ["Food packaging", "Beverages", "Chemicals", "Paints", "Lubricants", "Aerosols", "Industrial products"],
      "Gift Tin": ["Christmas gifts", "Birthday presents", "Corporate gifts", "Holiday treats", "Premium products", "Souvenirs"],
      "New Product": ["Innovative packaging", "Limited editions", "Seasonal products", "Exclusive designs", "Premium collections"]
    };
    
    const applications = applicationsMap[category] || ["General packaging", "Storage solutions"];
    const shuffled = [...applications].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 2);
  };

  // 生成随机颜色
  const generateRandomColor = () => {
    const colors = [
      "Silver", "Gold", "Black", "White", "Red", "Blue", "Green", 
      "Yellow", "Brown", "Purple", "Pink", "Teal", "Navy", "Cream"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 为每个产品类别定义独特的产品名称前缀
  const productNamePrefixes: Record<string, string[]> = {
    "Food Iron Box": [
      "Premium", "Deluxe", "Classic", "Artisan", "Gourmet", "Signature", "Royal", "Executive"
    ],
    "Wine Cans": [
      "Elegant", "Vintage", "Sophisticated", "Premium", "Refined", "Artisan", "Classic", "Royal"
    ],
    "Cosmetic Tin": [
      "Luxury", "Glamour", "Radiant", "Silk", "Diamond", "Pearl", "Crystal", "Velvet"
    ],
    "Tea Coffee Tin": [
      "Aroma", "Brew", "Bean", "Leaf", "Essence", "Heritage", "Morning", "Premium"
    ],
    "Household Goods Tin": [
      "Organize", "Home", "Essential", "Practical", "Stylish", "Durable", "Smart", "Compact"
    ],
    "Tinplate Can": [
      "Industrial", "Heavy-Duty", "Professional", "Commercial", "Durable", "Secure", "Reliable", "Robust"
    ],
    "Gift Tin": [
      "Celebration", "Joy", "Treasure", "Gift", "Special", "Memory", "Delight", "Surprise"
    ],
    "New Product": [
      "Innovative", "Revolutionary", "NextGen", "Future", "Evolve", "Pioneer", "Trailblazer", "Visionary"
    ]
  };

  // 为每个产品类别定义独特的产品名称后缀
  const productNameSuffixes: Record<string, string[]> = {
    "Food Iron Box": [
      "Container", "Box", "Tin", "Canister", "Jar", "Case", "Storage", "Holder"
    ],
    "Wine Cans": [
      "Wine Can", "Beverage Tin", "Drink Container", "Portable Bar", "Party Can", "Sip Tin", "Refreshment Case"
    ],
    "Cosmetic Tin": [
      "Beauty Case", "Makeup Tin", "Skincare Container", "Perfume Box", "Lip Balm Case", "Candle Holder"
    ],
    "Tea Coffee Tin": [
      "Coffee Tin", "Tea Caddy", "Beverage Container", "Herb Canister", "Spice Box", "Drink Storage"
    ],
    "Household Goods Tin": [
      "Storage Tin", "Organizer", "Utility Box", "Home Container", "Essential Case", "Accessory Holder"
    ],
    "Tinplate Can": [
      "Industrial Can", "Commercial Container", "Heavy Duty Tin", "Professional Case", "Secure Storage"
    ],
    "Gift Tin": [
      "Gift Box", "Present Container", "Surprise Case", "Holiday Tin", "Celebration Box", "Treasure Chest"
    ],
    "New Product": [
      "Innovation", "Breakthrough", "Evolution", "Revolution", "Future Design", "Next Generation"
    ]
  };

  // 为每个产品类别定义独特的描述模板
  const descriptionTemplates: Record<string, string[]> = {
    "Food Iron Box": [
      "Crafted with premium tinplate, this {color} container provides excellent protection for your {applications}. Its airtight seal ensures freshness and extends shelf life.",
      "This elegant {color} tin box features a sleek design that enhances product presentation while offering durable protection for {applications}. Perfect for both commercial and retail use.",
      "Our {color} food iron box combines functionality with aesthetic appeal, making it ideal for packaging {applications}. The sturdy construction ensures products remain safe during transport and storage.",
      "Designed specifically for {applications}, this {color} tin container offers superior protection against moisture and oxidation, keeping your products fresh for longer periods."
    ],
    "Wine Cans": [
      "This stylish {color} wine can offers a modern alternative to traditional glass bottles. Perfect for outdoor events, picnics, and on-the-go enjoyment of your favorite beverages.",
      "Crafted with premium materials, our {color} wine can preserves the flavor and aroma of your beverages while providing portability and convenience for any occasion.",
      "Ideal for {applications}, this {color} tin can features a secure seal that maintains product quality. Its sleek design makes it a popular choice for premium beverage packaging.",
      "Our {color} beverage can combines durability with aesthetic appeal, making it perfect for packaging {applications} in a modern, eco-friendly way."
    ],
    "Cosmetic Tin": [
      "This elegant {color} cosmetic tin adds a touch of luxury to your beauty products. Perfect for storing {applications} while protecting them from light and moisture.",
      "Crafted with precision, our {color} makeup container features a premium finish that enhances product value. Ideal for packaging high-end {applications}.",
      "Designed specifically for {applications}, this {color} tin box offers both style and functionality. The secure closure ensures products remain fresh and protected.",
      "Our {color} beauty tin combines practicality with sophistication, making it an excellent choice for packaging {applications} in a premium, eco-friendly manner."
    ],
    "Tea Coffee Tin": [
      "Preserve the freshness and flavor of your favorite {applications} with this premium {color} tin container. Its airtight seal locks in aroma and protects against moisture.",
      "Crafted for coffee and tea enthusiasts, this {color} storage tin maintains optimal conditions for {applications}. The elegant design adds a touch of sophistication to any kitchen.",
      "Our {color} beverage container is specifically designed to protect {applications} from light, air, and moisture. The durable construction ensures long-lasting performance.",
      "Ideal for storing {applications}, this {color} tin features a secure lid that creates an airtight seal, preserving the quality and freshness of your favorite beverages."
    ],
    "Household Goods Tin": [
      "Organize your home with this practical {color} storage tin. Perfect for keeping {applications} neatly stored while adding a touch of style to your living space.",
      "This versatile {color} container offers durable storage for {applications}. The stackable design helps maximize space while keeping your household items organized.",
      "Crafted with functionality in mind, our {color} utility tin provides a stylish solution for storing {applications}. The sturdy construction ensures long-term durability.",
      "Ideal for {applications}, this {color} storage box combines practicality with aesthetic appeal, making it a valuable addition to any organized household."
    ],
    "Tinplate Can": [
      "This heavy-duty {color} tinplate can is designed for industrial and commercial applications. Perfect for packaging {applications} with superior protection.",
      "Crafted to meet rigorous standards, our {color} industrial container provides reliable storage for {applications}. The robust construction ensures product safety during transport.",
      "Our {color} commercial tin offers exceptional durability and protection for {applications}. Designed to withstand demanding environments and maintain product integrity.",
      "Ideal for {applications}, this {color} tinplate container features a secure closure and sturdy construction, making it a reliable choice for industrial packaging needs."
    ],
    "Gift Tin": [
      "Make any occasion special with this elegant {color} gift tin. Perfect for presenting {applications} in a memorable, reusable container that will be cherished.",
      "Crafted with attention to detail, our {color} present box adds a touch of luxury to any gift. Ideal for packaging {applications} for holidays, birthdays, and special events.",
      "This decorative {color} tin makes the perfect gift package for {applications}. The high-quality finish and durable construction ensure it will be reused and appreciated.",
      "Ideal for creating memorable gifts, this {color} treasure box provides a beautiful presentation for {applications}. Its elegant design makes it a keepsake long after the contents are enjoyed."
    ],
    "New Product": [
      "Introducing our latest innovation: this {color} tin packaging solution redefines industry standards. Designed for {applications} with cutting-edge features.",
      "Our revolutionary {color} container represents the future of packaging for {applications}. Featuring innovative design elements and sustainable materials.",
      "Experience the next generation of packaging with this {color} tin solution. Perfect for {applications} that demand both functionality and forward-thinking design.",
      "Pioneering new standards in packaging, our {color} product offers unmatched performance for {applications}. Discover the difference innovative design can make."
    ]
  };

  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const color = generateRandomColor();
    const applications = generateRandomApplications(category);
    const features = generateRandomFeatures();
    
    // 生成独特的产品名称
    const prefixes = productNamePrefixes[category] || ["Premium"];
    const suffixes = productNameSuffixes[category] || ["Container"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    // 随机决定是否添加一个中间词，增加名称的多样性
    const hasMiddleWord = Math.random() > 0.5;
    let middleWord = "";
    
    if (hasMiddleWord) {
      const middleWords = ["Storage", "Collection", "Series", "Edition", "Design", "Craft", "Artisan"];
      middleWord = " " + middleWords[Math.floor(Math.random() * middleWords.length)];
    }
    
    // 生成独特的产品名称
    let productName = `${prefix}${middleWord} ${category.includes(' ') ? category.split(' ')[0] : category} ${suffix}`;
    
    // 对于前几个产品，可以使用更独特的名称
    if (index < 3) {
      const specialNames: Record<string, string[]> = {
        "Food Iron Box": [
          "Gourmet Delight Storage Tin",
          "Artisan Biscuit Collection Box",
          "Premium Chocolate Gift Container"
        ],
        "Wine Cans": [
          "Elegant Wine Traveler Can",
          "Vintage Cocktail Party Tin",
          "Premium Beverage Portable Container"
        ],
        "Cosmetic Tin": [
          "Luxury Beauty Essentials Box",
          "Glamour Makeup Collection Tin",
          "Radiant Skincare Storage Case"
        ],
        "Tea Coffee Tin": [
          "Aroma Preserve Coffee Container",
          "Morning Brew Tea Storage Tin",
          "Premium Herb Infusion Box"
        ],
        "Household Goods Tin": [
          "Organize Home Essentials Container",
          "Stylish Utility Storage Tin",
          "Smart Living Accessory Case"
        ],
        "Tinplate Can": [
          "Industrial Strength Storage Container",
          "Professional Grade Secure Tin",
          "Heavy Duty Transport Canister"
        ],
        "Gift Tin": [
          "Treasure Chest Gift Box",
          "Celebration Memories Container",
          "Joyful Surprise Present Tin"
        ],
        "New Product": [
          "NextGen Packaging Innovation",
          "Revolutionary Design Container",
          "Future Tech Storage Solution"
        ]
      };
      
      const categorySpecialNames = specialNames[category];
      if (categorySpecialNames && index < categorySpecialNames.length) {
        productName = categorySpecialNames[index];
      }
    }
    
    // 生成独特的描述
    const templates = descriptionTemplates[category] || [
      `This high-quality ${category.toLowerCase()} is perfect for various applications. It features durable construction and elegant design.`
    ];
    let description = templates[Math.floor(Math.random() * templates.length)];
    
    // 替换描述中的占位符
    description = description.replace(/{color}/g, color);
    description = description.replace(/{applications}/g, applications.join(", "));
    
    // 生成简短描述
    const shortDescriptionTemplates = [
      `Premium ${category.toLowerCase()} for ${applications[0]}`,
      `${prefix} quality storage solution`,
      `Elegant ${color.toLowerCase()} container for your needs`,
      `Durable packaging for ${applications.slice(0, 2).join(" and ")}`
    ];
    const shortDescription = shortDescriptionTemplates[Math.floor(Math.random() * shortDescriptionTemplates.length)];
    
    // 生成额外图片 - 从"数据库"获取或生成
    const additionalImages = [];
    for (let i = 1; i <= 3; i++) {
       additionalImages.push(getProductImageFromDb(id + i * 100, category));
    }
    
    return {
      id,
      name: productName,
      description,
      shortDescription,
      // 从"数据库"获取图片URL
      imageUrl: getProductImageFromDb(id, category),
      additionalImages,
      rating: Math.floor(Math.random() * 2) + 4, // 随机评分4-5星
      category,
      dimensions: {
        height: Math.floor(Math.random() * 10) + 5,
        width: Math.floor(Math.random() * 10) + 5,
        depth: Math.floor(Math.random() * 10) + 5,
        unit: "cm"
      },
      material: "Tinplate",
      capacity: `${Math.floor(Math.random() * 500) + 100} ml`,
      color,
      features,
      applications,
      minOrderQuantity: Math.floor(Math.random() * 500) + 500,
      isNew: index < 5,
      isFeatured: index % 10 === 0,
      createdAt: generateRandomDate()
    };
  });
};

// 食品铁盒数据
// 食品铁盒数据，已为ID为1的产品添加特殊的心形巧克力盒图片
export const foodIronBoxProducts = generateProducts('Food Iron Box', 242);

// 酒罐数据
export const wineCansProducts = generateProducts('Wine Cans', 84);

// 化妆品罐数据
export const cosmeticTinProducts = generateProducts('Cosmetic Tin', 83);

// 茶咖啡罐数据
export const teaCoffeeTinProducts = generateProducts('Tea Coffee Tin', 44);

// 家居用品罐数据
export const householdGoodsTinProducts = generateProducts('Household Goods Tin', 56);

// 马口铁罐数据
export const tinplateCanProducts = generateProducts('Tinplate Can', 13);

// 礼品罐数据
export const giftTinProducts = generateProducts('Gift Tin', 62);

// 新产品展示数据
export const newProductDisplayProducts = generateProducts('New Product', 13);

// 产品类别数据 - 从"数据库"获取图片URL
export const productCategories: ProductCategory[] = [
  {
    id: 1,
    name: "Food Iron Box",
    icon: "fa-utensils",
    imageUrl: imageDb.categoryImages[1] || imageDb.defaultImage,
    description: "Premium iron boxes designed to keep food fresh and extend shelf life",
    count: foodIronBoxProducts.length
  },
  {
    id: 2,
    name: "Wine Cans",
    icon: "fa-wine-bottle",
    imageUrl: imageDb.categoryImages[2] || imageDb.defaultImage,
    description: "Stylish and durable cans for wine and other beverages",
    count: wineCansProducts.length
  },
  {
    id: 3,
    name: "Cosmetic Tin",
    icon: "fa-pump-soap",
    imageUrl: imageDb.categoryImages[3] || imageDb.defaultImage,
    description: "Elegant tins for cosmetic products and personal care items",
    count: cosmeticTinProducts.length
  },
  {
    id: 4,
    name: "Tea Coffee Tin",
    icon: "fa-mug-hot",
    imageUrl: imageDb.categoryImages[4] || imageDb.defaultImage,
    description: "Specialized tins to preserve the freshness of tea and coffee",
    count: teaCoffeeTinProducts.length
  },
  {
    id: 5,
    name: "Household Goods Tin",
    icon: "fa-home",
    imageUrl: imageDb.categoryImages[5] || imageDb.defaultImage,
    description: "Practical tins for organizing and storing household items",
    count: householdGoodsTinProducts.length
  },
  {
    id: 6,
    name: "Tinplate Can",
    icon: "fa-industry",
    imageUrl: imageDb.categoryImages[6] || imageDb.defaultImage,
    description: "Durable cans for industrial and commercial applications",
    count: tinplateCanProducts.length
  },
  {
    id: 7,
    name: "Gift Tin",
    icon: "fa-gift",
    imageUrl: imageDb.categoryImages[7] || imageDb.defaultImage,
    description: "Decorative tins perfect for gift packaging and special occasions",
    count: giftTinProducts.length
  },
  {
    id: 8,
    name: "New Products",
    icon: "fa-star",
    imageUrl: imageDb.categoryImages[8] || imageDb.defaultImage,
    description: "Latest innovations and new arrivals in tin packaging solutions",
    count: newProductDisplayProducts.length
  }
];

// 从数据库获取产品的辅助函数
const getProductsFromDb = (): Product[] => {
  const products = productDb.getAll();
  
  // 如果数据库中没有产品，初始化一些示例数据
  if (products.length === 0) {
    // 创建一个综合的产品示例集合
    const sampleProducts = [];
    
    // 从每种类别中获取一些示例产品
    if (foodIronBoxProducts.length > 0) {
      sampleProducts.push(...foodIronBoxProducts.slice(0, 5));
    }
    if (wineCansProducts.length > 0) {
      sampleProducts.push(...wineCansProducts.slice(0, 3));
    }
    if (cosmeticTinProducts.length > 0) {
      sampleProducts.push(...cosmeticTinProducts.slice(0, 3));
    }
    
    // 将示例产品保存到数据库
    sampleProducts.forEach(product => {
      // 移除id，让数据库服务自动生成
      const { id, ...productWithoutId } = product;
      productDb.add(productWithoutId);
    });
    
    // 返回新保存的产品
    return productDb.getAll();
  }
  
  return products;
};

// 获取所有产品 - 确保优先获取数据库服务中的最新数据
export const getAllProducts = (): Product[] => {
  const products = getProductsFromDb();
  
  // 按创建日期倒序排序，确保最新添加的产品显示在前面
  return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 根据ID获取产品
export const getProductById = (id: number): Product | undefined => {
  return productDb.getById(id);
};

// 根据类别获取产品
export const getProductsByCategory = (category: string): Product[] => {
  const products = getProductsFromDb();
  return products.filter(product => product.category === category);
};

// 获取特色产品
export const getFeaturedProducts = (limit: number = 8): Product[] => {
  const products = getProductsFromDb();
  return products.filter(product => product.isFeatured).slice(0, limit);
};

// 获取新产品
export const getNewProducts = (limit: number = 8): Product[] => {
  const products = getProductsFromDb();
  return products.filter(product => product.isNew).slice(0, limit);
};