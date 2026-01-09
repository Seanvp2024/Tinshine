import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '@/contexts/authContext';
import { 
  foodIronBoxProducts,
  wineCansProducts,
  cosmeticTinProducts,
  teaCoffeeTinProducts,
  householdGoodsTinProducts,
  tinplateCanProducts,
  giftTinProducts,
  newProductDisplayProducts,
  Product,
  imageDb
} from '@/lib/productData';
import { storage } from '@/lib/utils';
import { productDb, db, APP_ID, SYNC_DATA_KEY, blogDb } from '@/services/dbService';

// Define editable fields interface
interface EditableField {
  id: keyof Product;
  label: string;
  type: 'text' | 'textarea' | 'url';
}

// Blog post interface
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

// Blog post editable fields
interface BlogEditableField {
  id: keyof BlogPost;
  label: string;
  type: 'text' | 'textarea' | 'url';
}

// Admin Navigation component
const AdminNavigation: React.FC<{
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isAddingProduct: boolean;
  isAddingBlog: boolean;
  setIsAddingProduct: (adding: boolean) => void;
  setIsAddingBlog: (adding: boolean) => void;
  setFormData: (data: Partial<Product>) => void;
  setBlogFormData: (data: Partial<BlogPost>) => void;
}> = ({
  selectedCategory,
  setSelectedCategory,
  isAddingProduct,
  isAddingBlog,
  setIsAddingProduct,
  setIsAddingBlog,
  setFormData,
  setBlogFormData
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-bold">Product Management</h2>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => {
                setIsAddingProduct(true);
                setIsAddingBlog(false);
                setFormData({});
              }}
              disabled={isAddingProduct}
              className={`px-4 py-2 ${isAddingProduct ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'} rounded-lg transition-colors duration-300 flex items-center`}
            >
              <i className="fas fa-plus mr-2"></i> Add Product
            </button>
            <button
              onClick={() => {
                setIsAddingBlog(true);
                setIsAddingProduct(false);
                setBlogFormData({});
              }}
              disabled={isAddingBlog}
              className={`px-4 py-2 ${isAddingBlog ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'} rounded-lg transition-colors duration-300 flex items-center`}
            >
              <i className="fas fa-plus mr-2"></i> Add Blog
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'foodIronBox', name: 'Food Iron Box' },
            { id: 'wineCans', name: 'Wine Cans' },
            { id: 'cosmeticTin', name: 'Cosmetic Tin' },
            { id: 'teaCoffeeTin', name: 'Tea Coffee Tin' },
            { id: 'householdGoodsTin', name: 'Household Goods Tin' },
            { id: 'tinplateCan', name: 'Tinplate Can' },
            { id: 'giftTin', name: 'Gift Tin' },
            { id: 'newProductDisplay', name: 'New Products' },
          ].map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Editor component
const ProductEditor: React.FC<{
  product: Product;
  formData: Partial<Product>;
  setFormData: (data: Partial<Product>) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({
  product,
  formData,
  setFormData,
  onSave,
  onCancel,
  isLoading
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const editableFields: EditableField[] = [
    { id: 'name', label: 'Product Name', type: 'text' },
    { id: 'description', label: 'Description', type: 'textarea' },
    { id: 'shortDescription', label: 'Short Description', type: 'text' },
    { id: 'imageUrl', label: 'Image URL', type: 'url' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Product: {product.name}</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving...
                </div>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields */}
          <div className="space-y-4">
            {editableFields.map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Product Preview */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Product Preview</h3>
            <div className="relative w-full max-w-xs">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt={formData.name || 'Product Image'}
                  className="w-full h-48 object-contain border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-2"
                />
              )}
              {!formData.imageUrl && (
                <div className="w-full h-48 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No image</span>
                </div>
              )}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium mb-1 truncate">{formData.name || 'Product Name'}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{formData.shortDescription || 'Short description'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{formData.description || 'Product description'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add Product Form component
const AddProductForm: React.FC<{
  categoryName: string;
  formData: Partial<Product>;
  setFormData: (data: Partial<Product>) => void;
  onAdd: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({
  categoryName,
  formData,
  setFormData,
  onAdd,
  onCancel,
  isLoading
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const editableFields: EditableField[] = [
    { id: 'name', label: 'Product Name', type: 'text' },
    { id: 'description', label: 'Description', type: 'textarea' },
    { id: 'shortDescription', label: 'Short Description', type: 'text' },
    { id: 'imageUrl', label: 'Image URL', type: 'url' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Product to {categoryName}</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Adding...
                </div>
              ) : (
                <span>Add Product</span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields */}
          <div className="space-y-4">
            {editableFields.map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder={field.label}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    placeholder={field.label}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Product Preview */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Product Preview</h3>
            <div className="relative w-full max-w-xs">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt={formData.name || 'Product Image'}
                  className="w-full h-48 object-contain border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-2"
                />
              )}
              {!formData.imageUrl && (
                <div className="w-full h-48 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No image</span>
                </div>
              )}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium mb-1 truncate">{formData.name || 'Product Name'}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{formData.shortDescription || 'Short description'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{formData.description || 'Product description'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add Blog Form component
const AddBlogForm: React.FC<{
  blogFormData: Partial<BlogPost>;
  setBlogFormData: (data: Partial<BlogPost>) => void;
  onAdd: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({
  blogFormData,
  setBlogFormData,
  onAdd,
  onCancel,
  isLoading
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const blogEditableFields: BlogEditableField[] = [
    { id: 'title', label: 'Blog Title', type: 'text' },
    { id: 'excerpt', label: 'Excerpt', type: 'text' },
    { id: 'content', label: 'Content', type: 'textarea' },
    { id: 'imageUrl', label: 'Image URL', type: 'url' },
    { id: 'category', label: 'Category', type: 'text' },
    { id: 'author', label: 'Author', type: 'text' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Blog Post</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Adding...
                </div>
              ) : (
                <span>Add Blog</span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields */}
          <div className="space-y-4">
            {blogEditableFields.map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    value={blogFormData[field.id] || ''}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder={field.label}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={blogFormData[field.id] || ''}
                    onChange={handleInputChange}
                    placeholder={field.label}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Blog Preview */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Blog Preview</h3>
            <div className="relative w-full max-w-xs">
              {blogFormData.imageUrl && (
                <img
                  src={blogFormData.imageUrl}
                  alt={blogFormData.title || 'Blog Image'}
                  className="w-full h-48 object-cover border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                />
              )}
              {!blogFormData.imageUrl && (
                <div className="w-full h-48 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No image</span>
                </div>
              )}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium mb-2">{blogFormData.title || 'Blog Title'}</h4>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {blogFormData.author && <span>{blogFormData.author}</span>}
                  {blogFormData.author && blogFormData.category && <span className="mx-2">•</span>}
                  {blogFormData.category && <span>{blogFormData.category}</span>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{blogFormData.content || 'Blog content...'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Product List component
const ProductList: React.FC<{
  products: Product[];
  selectedCategory: string;
  onEdit: (product: Product) => void;
}> = ({ products, selectedCategory, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4">Products in {selectedCategory}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <button
                      onClick={() => onEdit(product)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200 mr-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// AdminLayout component - 统一的后台布局
const AdminLayout: React.FC<{
  children: React.ReactNode;
  onLogout: () => void;
}> = ({ children, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-shield-alt text-blue-600 mr-2"></i>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>

        {/* Admin Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
            <i className="fas fa-lightbulb mr-2"></i> Admin Tips
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li><i className="fas fa-check-circle mr-1"></i> All changes are automatically saved to the backend database and will synchronize across all devices.</li>
            <li><i className="fas fa-check-circle mr-1"></i> You can edit product images by providing a valid image URL, and the changes will be reflected immediately.</li>
            <li><i className="fas fa-check-circle mr-1"></i> The system automatically creates backups of your data for safety and reliability.</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Admin Panel © {new Date().getFullYear()} | Last updated: {new Date().toLocaleString()}</p>
        </div>
      </footer>
    </div>
  );
};

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState('foodIronBox');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Load products based on selected category - 确保使用数据库中的最新数据
  useEffect(() => {
    // 获取产品类别名称
    const categoryMap: Record<string, string> = {
      foodIronBox: 'Food Iron Box',
      wineCans: 'Wine Cans',
      cosmeticTin: 'Cosmetic Tin',
      teaCoffeeTin: 'Tea Coffee Tin',
      householdGoodsTin: 'Household Goods Tin',
      tinplateCan: 'Tinplate Can',
      giftTin: 'Gift Tin',
      newProductDisplay: 'New Product'
    };
    
    const categoryName = categoryMap[selectedCategory] || 'New Product';
    
    // 从数据库中查找该类别的产品
    const dbProducts = productDb.find({ category: categoryName });
    
    // 如果数据库中没有该类别的产品，使用默认数据
    if (dbProducts.length === 0) {
      const defaultCategoryMap: Record<string, Product[]> = {
        foodIronBox: foodIronBoxProducts,
        wineCans: wineCansProducts,
        cosmeticTin: cosmeticTinProducts,
        teaCoffeeTin: teaCoffeeTinProducts,
        householdGoodsTin: householdGoodsTinProducts,
        tinplateCan: tinplateCanProducts,
        giftTin: giftTinProducts,
        newProductDisplay: newProductDisplayProducts,
      };
      setProducts(defaultCategoryMap[selectedCategory] || []);
    } else {
      setProducts(dbProducts);
    }
    
    setSelectedProduct(null);
    setIsEditing(false);
  }, [selectedCategory]);

  // 组件挂载时初始化数据库
  useEffect(() => {
    // 确保加载最新的图片数据库
    db.loadImageDb();
    
    // 如果产品数据库为空，初始化一些示例数据
    if (productDb.count() === 0) {
      // 初始化产品数据
      const initializeProducts = () => {
        const sampleProducts = [
          // 从每种类别中选取一些产品作为示例
          ...foodIronBoxProducts.slice(0, 5),
          ...wineCansProducts.slice(0, 3),
          ...cosmeticTinProducts.slice(0, 3),
          ...teaCoffeeTinProducts.slice(0, 2)
        ];
        
        // 将示例产品添加到数据库
        sampleProducts.forEach(product => {
          const { id, createdAt, updatedAt, ...productWithoutIds } = product;
          productDb.add(productWithoutIds);
        });
      };
      
      initializeProducts();
    }
  }, []);

  // 监听数据库更新事件，确保显示最新数据
  useEffect(() => {
    const handleDataUpdate = () => {
      // 重新加载当前类别的产品
      const categoryMap: Record<string, string> = {
        foodIronBox: 'Food Iron Box',
        wineCans: 'Wine Cans',
        cosmeticTin: 'Cosmetic Tin',
        teaCoffeeTin: 'Tea Coffee Tin',
        householdGoodsTin: 'Household Goods Tin',
        tinplateCan: 'Tinplate Can',
        giftTin: 'Gift Tin',
        newProductDisplay: 'New Product'
      };
      
      const categoryName = categoryMap[selectedCategory] || 'New Product';
      const dbProducts = productDb.find({ category: categoryName });
      
      if (dbProducts.length > 0) {
        setProducts(dbProducts);
      }
      
      // 重新加载图片数据库
      db.loadImageDb();
    };
    
    // 监听数据更新事件
    const unsubscribe = db.onDataUpdate(handleDataUpdate);
    
    return () => unsubscribe();
  }, [selectedCategory]);

  // Load product data for editing
  useEffect(() => {
    if (selectedProduct) {
      setFormData({ ...selectedProduct });
    }
  }, [selectedProduct]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ ...product });
    setIsEditing(true);
    setIsAddingProduct(false);
    setIsAddingBlog(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setFormData({});
    setIsAddingProduct(false);
    setIsAddingBlog(false);
  };

  // Get category name from category ID
  const getCategoryName = (): string => {
    const categoryMap: Record<string, string> = {
      foodIronBox: 'Food Iron Box',
      wineCans: 'Wine Cans',
      cosmeticTin: 'Cosmetic Tin',
      teaCoffeeTin: 'Tea Coffee Tin',
      householdGoodsTin: 'Household Goods Tin',
      tinplateCan: 'Tinplate Can',
      giftTin: 'Gift Tin',
      newProductDisplay: 'New Product'
    };
    return categoryMap[selectedCategory] || 'New Product';
  };

  // Save edited product - 增强版，确保数据同步到数据库
  const handleSave = async () => {
    if (!selectedProduct || !formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // 使用异步API更新产品
      const updatedProduct = await productDb.update(selectedProduct.id, formData);
      
      if (updatedProduct) {
        // 更新本地状态以立即显示变更
        const updatedProducts = products.map(p => 
          p.id === updatedProduct.id ? updatedProduct : p
        );
        
        setProducts(updatedProducts);
        setSelectedProduct(updatedProduct);
        setIsEditing(false);
        
        toast.success('Product updated successfully and saved to server!');
      } else {
        toast.error('Product not found in database');
      }
    } catch (error) {
      toast.error('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new product - 增强版，确保数据同步到数据库
  const handleAddProduct = async () => {
    if (!formData.name || !formData.description || !formData.imageUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // 创建新产品对象
      const productToAdd = {
        name: formData.name as string,
        description: formData.description as string,
        shortDescription: formData.shortDescription as string || 'New product',
        imageUrl: formData.imageUrl as string,
        additionalImages: [],
        rating: 5,
        category: getCategoryName(),
        dimensions: {
          height: 10,
          width: 10,
          depth: 10,
          unit: "cm"
        },
        material: "Tinplate",
        capacity: "250 ml",
        color: "Silver",
        features: ["Durable construction", "Elegant design", "Recyclable"],
        applications: ["General packaging"],
        minOrderQuantity: 1000,
        isNew: true,
        isFeatured: false
      };
      
      // 保存新产品到服务器
      const newProduct = await productDb.add(productToAdd);
      
      // 更新本地状态以立即显示新产品
      setProducts([newProduct, ...products]);
      setIsAddingProduct(false);
      setFormData({});
      
      toast.success('Product added successfully and saved to server!');
    } catch (error) {
      toast.error('Failed to add product. Please try again.');
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new blog post - 使用新的blogDb接口
  const handleAddBlog = async () => {
    if (!blogFormData.title || !blogFormData.content || !blogFormData.imageUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // 创建新博客文章对象
      const blogToAdd = {
        title: blogFormData.title as string,
        excerpt: blogFormData.excerpt as string || '',
        content: blogFormData.content as string,
        imageUrl: blogFormData.imageUrl as string,
        category: blogFormData.category as string || 'Company News',
        author: blogFormData.author as string || 'Admin',
        authorImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Professional%20writer%20portrait&sign=9284120bb212b63ca3f9fffe31c8d3e7",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        readTime: Math.ceil((blogFormData.content as string).split(/\s+/).length / 200),
        likes: 0
      };
      
      // 使用新的blogDb接口添加博客文章到服务器
      await blogDb.add(blogToAdd);
      
      setIsAddingBlog(false);
      setBlogFormData({});
      
      toast.success('Blog post added successfully and saved to server!');
    } catch (error) {
      toast.error('Failed to add blog post. Please try again.');
      console.error('Error adding blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('You have been logged out successfully');
  };

  // If not authenticated, return null to prevent rendering
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <AdminNavigation
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isAddingProduct={isAddingProduct}
        isAddingBlog={isAddingBlog}
        setIsAddingProduct={setIsAddingProduct}
        setIsAddingBlog={setIsAddingBlog}
        setFormData={setFormData}
        setBlogFormData={setBlogFormData}
      />

      {/* Main content area based on current state */}
      {isEditing && selectedProduct && (
        <ProductEditor
          product={selectedProduct}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}

      {isAddingProduct && (
        <AddProductForm
          categoryName={getCategoryName()}
          formData={formData}
          setFormData={setFormData}
          onAdd={handleAddProduct}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}

      {isAddingBlog && (
        <AddBlogForm
          blogFormData={blogFormData}
          setBlogFormData={setBlogFormData}
          onAdd={handleAddBlog}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}

      {!isEditing && !isAddingProduct && !isAddingBlog && (
        <ProductList
          products={products}
          selectedCategory={selectedCategory}
          onEdit={handleEdit}
        />
      )}
     </AdminLayout>
  );
};

  {/* 数据同步状态指示器组件 */}
  export function DataSyncIndicator() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>('Never');
  
  // 检查同步状态
  useEffect(() => {
    // 获取上次同步时间
    const syncTime = localStorage.getItem(`${APP_ID}_last_sync`);
    if (syncTime) {
      setLastSync(new Date(parseInt(syncTime)).toLocaleString());
    }
    
    // 设置定期检查同步的定时器
    const checkSyncInterval = setInterval(() => {
      // 检查是否有新的同步数据
      const syncData = localStorage.getItem(SYNC_DATA_KEY);
      if (syncData) {
        try {
          const syncInfo = JSON.parse(syncData);
          // 如果有新的数据版本，提示用户
          if (syncInfo.version > db.getCurrentVersion()) {
            if (confirm('New data available. Would you like to sync now?')) {
              handleImportData(syncData);
            }
          }
        } catch (error) {
          console.error('Error checking sync data:', error);
        }
      }
    }, 30000); // 每30秒检查一次
    
    return () => clearInterval(checkSyncInterval);
  }, []);
  
  // 导入数据
  const handleImportData = (jsonData?: string) => {
    setIsSyncing(true);
    
    try {
      let dataToImport = jsonData;
      
      // 如果没有提供数据，则从localStorage获取
      if (!dataToImport) {
        dataToImport = localStorage.getItem(SYNC_DATA_KEY);
        if (!dataToImport) {
          toast.error('No sync data available');
          return;
        }
      }
      
      // 导入数据
      const success = db.importData(dataToImport);
      
      if (success) {
        toast.success('Data synced successfully!');
        setLastSync(new Date().toLocaleString());
        localStorage.setItem(`${APP_ID}_last_sync`, Date.now().toString());
      } else {
        toast.error('Failed to sync data or data is not newer');
      }
    } catch (error) {
      toast.error('Error syncing data');
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // 导出数据
  const handleExportData = () => {
    try {
      setIsSyncing(true);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(db.exportData());
      
      // 创建下载链接
      const exportLink = document.createElement('a');
      exportLink.href = dataUri;
      exportLink.download = `tinshine-sync-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(exportLink);
      exportLink.click();
      document.body.removeChild(exportLink);
      
      toast.success('Data exported successfully! Share this file with other devices.');
      setLastSync(new Date().toLocaleString());
      localStorage.setItem(`${APP_ID}_last_sync`, Date.now().toString());
    } catch (error) {
      toast.error('Error exporting data');
      console.error('Error during export:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExportData}
        disabled={isSyncing}
        className={`px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center ${
          isSyncing ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
        }`}
        title="Export data for syncing"
      >
        {isSyncing ? (
          <i className="fas fa-spinner fa-spin mr-2"></i>
        ) : (
          <i className="fas fa-upload mr-2"></i>
        )}
        {isSyncing ? 'Syncing...' : 'Export Data'}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleImportData}
        disabled={isSyncing}
        className={`px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center ${
          isSyncing ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        title="Import data from another device"
      >
        {isSyncing ? (
          <i className="fas fa-spinner fa-spin mr-2"></i>
        ) : (
          <i className="fas fa-download mr-2"></i>
        )}
        {isSyncing ? 'Syncing...' : 'Import Data'}
      </motion.button>
      
      <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-sm text-gray-700 dark:text-gray-300 flex items-center">
        <i className="fas fa-clock mr-2 text-gray-500"></i>
        <span className="hidden sm:inline">Last sync: {lastSync}</span>
        <span className="sm:hidden">Last: {lastSync.split(',')[0]}</span>
      </div>
    </div>
  );
}