import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, TrendingUp, Check, X, Edit, Trash2, Plus } from 'lucide-react';
import { RequireAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUsers, setUsers, getProducts, setProducts, getCategories, setCategories, getOrders } from '../data/mockData';
import { User, Product, Category, Order } from '../types';

const AdminDashboard: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'categories' | 'products' | 'orders'>('overview');
  const [users, setUsersState] = useState<User[]>([]);
  const [products, setProductsState] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);

  useEffect(() => {
    setUsersState(getUsers());
    setProductsState(getProducts());
    setCategoriesState(getCategories());
    setOrdersState(getOrders());
  }, []);

  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const pendingSellers = users.filter(u => u.role === 'SELLER' && !u.isApproved);

  return (
    <RequireAuth roles={['ADMIN']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-green-600">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-purple-600">{totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-orange-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border rounded-lg">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'users', label: 'Users', icon: Users },
                { key: 'categories', label: 'Categories', icon: Package },
                { key: 'products', label: 'Products', icon: Package },
                { key: 'orders', label: 'Orders', icon: ShoppingCart }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab 
                users={users} 
                products={products} 
                orders={orders} 
                pendingSellers={pendingSellers}
              />
            )}
            
            {activeTab === 'users' && (
              <UsersTab 
                users={users} 
                onUsersChange={setUsersState}
              />
            )}
            
            {activeTab === 'categories' && (
              <CategoriesTab 
                categories={categories} 
                onCategoriesChange={setCategoriesState}
              />
            )}
            
            {activeTab === 'products' && (
              <ProductsTab 
                products={products} 
                onProductsChange={setProductsState}
              />
            )}
            
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} />
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

// Overview Tab
const OverviewTab: React.FC<{
  users: User[];
  products: Product[];
  orders: Order[];
  pendingSellers: User[];
}> = ({ users, products, orders, pendingSellers }) => {
  const recentOrders = orders.slice(-5).reverse();
  const topProducts = products
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {pendingSellers.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            Pending Seller Approvals ({pendingSellers.length})
          </h3>
          <div className="space-y-3">
            {pendingSellers.map(seller => (
              <div key={seller.id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                <div>
                  <div className="font-medium">{seller.name}</div>
                  <div className="text-sm text-gray-500">{seller.email}</div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">#{order.id.slice(-8).toUpperCase()}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${order.total.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-500">
                      ⭐ {product.ratingAvg.toFixed(1)} ({product.ratingCount})
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${product.price}</div>
                  <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Users Tab
const UsersTab: React.FC<{
  users: User[];
  onUsersChange: (users: User[]) => void;
}> = ({ users, onUsersChange }) => {
  const { addToast } = useToast();

  const handleApprove = (userId: string) => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, isApproved: true } : u
    );
    setUsers(updatedUsers);
    onUsersChange(updatedUsers);
    addToast('success', 'Seller approved successfully!');
  };

  const handleBlock = (userId: string) => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u
    );
    setUsers(updatedUsers);
    onUsersChange(updatedUsers);
    addToast('success', 'User status updated!');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                    user.role === 'SELLER' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    {user.role === 'SELLER' && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    )}
                    {user.isBlocked && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Blocked
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    {user.role === 'SELLER' && !user.isApproved && (
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Approve Seller"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleBlock(user.id)}
                      className={`p-1 rounded transition-colors ${
                        user.isBlocked 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title={user.isBlocked ? 'Unblock User' : 'Block User'}
                    >
                      {user.isBlocked ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Categories Tab
const CategoriesTab: React.FC<{
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}> = ({ categories, onCategoriesChange }) => {
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '',
    parentId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      const updatedCategories = categories.map(c =>
        c.id === editingCategory.id
          ? { ...c, ...categoryForm, parentId: categoryForm.parentId || null }
          : c
      );
      setCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      addToast('success', 'Category updated successfully!');
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        ...categoryForm,
        parentId: categoryForm.parentId || null
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      addToast('success', 'Category created successfully!');
    }

    setShowForm(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', icon: '', parentId: '' });
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(c => c.id !== categoryId && c.parentId !== categoryId);
      setCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      addToast('success', 'Category deleted successfully!');
    }
  };

  const parentCategories = categories.filter(c => !c.parentId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Category Management</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="📱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  value={categoryForm.parentId}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {parentCategories.map(category => {
          const subcategories = categories.filter(c => c.parentId === category.id);
          return (
            <div key={category.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setCategoryForm({
                        name: category.name,
                        icon: category.icon || '',
                        parentId: category.parentId || ''
                      });
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {subcategories.length > 0 && (
                <div className="ml-8 space-y-2">
                  {subcategories.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between py-2">
                      <span className="text-gray-700">{sub.name}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingCategory(sub);
                            setCategoryForm({
                              name: sub.name,
                              icon: sub.icon || '',
                              parentId: sub.parentId || ''
                            });
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Products Tab
const ProductsTab: React.FC<{
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}> = ({ products, onProductsChange }) => {
  const { addToast } = useToast();

  const handleToggleActive = (productId: string) => {
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    );
    setProducts(updatedProducts);
    onProductsChange(updatedProducts);
    addToast('success', 'Product status updated!');
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      onProductsChange(updatedProducts);
      addToast('success', 'Product deleted successfully!');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Product Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold">${product.price}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Stock: {product.stock}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleActive(product.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      product.isActive 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {product.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Orders Tab
const OrdersTab: React.FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Order Management</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                <div className={`text-sm px-2 py-1 rounded-full ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {order.items.length} items • {order.sellerBreakdown.length} seller(s)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;