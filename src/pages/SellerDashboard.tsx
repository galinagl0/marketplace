import React, { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth, RequireAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getProducts, setProducts, getOrders, getCategories } from '../data/mockData';
import { Product, Order } from '../types';

const SellerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [products, setProductsState] = useState<Product[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (currentUser?.role === 'SELLER') {
      const allProducts = getProducts();
      const sellerProducts = allProducts.filter(p => p.sellerId === currentUser.id);
      setProductsState(sellerProducts);

      const allOrders = getOrders();
      const sellerOrders = allOrders.filter((order: Order) => 
        order.sellerBreakdown.some(breakdown => breakdown.sellerId === currentUser.id)
      );
      setOrdersState(sellerOrders);
    }
  }, [currentUser]);

  const totalRevenue = orders.reduce((sum, order) => {
    const sellerBreakdown = order.sellerBreakdown.find(b => b.sellerId === currentUser?.id);
    return sum + (sellerBreakdown?.subtotal || 0);
  }, 0);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const averageRating = products.length > 0 
    ? products.reduce((sum, p) => sum + p.ratingAvg, 0) / products.length 
    : 0;

  return (
    <RequireAuth roles={['SELLER']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <div className="text-sm text-gray-600">
            Welcome back, {currentUser?.name}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-purple-600">{totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border rounded-lg">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'products', label: 'Products', icon: Package },
                { key: 'orders', label: 'Orders', icon: ShoppingCart },
                { key: 'analytics', label: 'Analytics', icon: TrendingUp }
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
            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                onProductsChange={setProductsState}
                showForm={showProductForm}
                setShowForm={setShowProductForm}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
              />
            )}
            
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} sellerId={currentUser?.id || ''} />
            )}
            
            {activeTab === 'analytics' && (
              <AnalyticsTab products={products} orders={orders} sellerId={currentUser?.id || ''} />
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

// Products Tab Component
const ProductsTab: React.FC<{
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
}> = ({ products, onProductsChange, showForm, setShowForm, editingProduct, setEditingProduct }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const categories = getCategories();
  
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: 0,
    images: [''],
    brand: '',
    stock: 0,
    categoryId: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setProductForm({
        title: editingProduct.title,
        description: editingProduct.description,
        price: editingProduct.price,
        images: editingProduct.images,
        brand: editingProduct.brand,
        stock: editingProduct.stock,
        categoryId: editingProduct.categoryId
      });
      setShowForm(true);
    }
  }, [editingProduct, setShowForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    const allProducts = getProducts();
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = allProducts.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...productForm }
          : p
      );
      setProducts(updatedProducts);
      onProductsChange(updatedProducts.filter(p => p.sellerId === currentUser.id));
      addToast('success', 'Product updated successfully!');
    } else {
      // Create new product
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...productForm,
        sellerId: currentUser.id,
        ratingAvg: 0,
        ratingCount: 0,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      const updatedProducts = [...allProducts, newProduct];
      setProducts(updatedProducts);
      onProductsChange([...products, newProduct]);
      addToast('success', 'Product created successfully!');
    }

    setShowForm(false);
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      price: 0,
      images: [''],
      brand: '',
      stock: 0,
      categoryId: ''
    });
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const allProducts = getProducts();
      const updatedProducts = allProducts.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      onProductsChange(products.filter(p => p.id !== productId));
      addToast('success', 'Product deleted successfully!');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Products ({products.length})</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                required
                value={productForm.images[0]}
                onChange={(e) => setProductForm({ 
                  ...productForm, 
                  images: [e.target.value, ...productForm.images.slice(1)] 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white border rounded-lg overflow-hidden">
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
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  ⭐ {product.ratingAvg.toFixed(1)} ({product.ratingCount})
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
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

      {products.length === 0 && !showForm && (
        <div className="text-center py-16">
          <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No products yet</h2>
          <p className="text-gray-500 mb-8">Start by adding your first product</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );
};

// Orders Tab Component
const OrdersTab: React.FC<{ orders: Order[]; sellerId: string }> = ({ orders, sellerId }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Orders Containing My Products</h2>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-600 mb-4">No orders yet</h3>
          <p className="text-gray-500">Orders will appear here when customers buy your products</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const sellerBreakdown = order.sellerBreakdown.find(b => b.sellerId === sellerId);
            return sellerBreakdown ? (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${sellerBreakdown.subtotal.toFixed(2)}</div>
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
                  {sellerBreakdown.items.length} item(s) from your store
                </div>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{ products: Product[]; orders: Order[]; sellerId: string }> = ({ 
  products, 
  orders, 
  sellerId 
}) => {
  const revenue = orders.reduce((sum, order) => {
    const sellerBreakdown = order.sellerBreakdown.find(b => b.sellerId === sellerId);
    return sum + (sellerBreakdown?.subtotal || 0);
  }, 0);

  const topProducts = products
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Sales Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-blue-600">${revenue.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">{orders.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-2">Active Products</h3>
            <p className="text-3xl font-bold text-purple-600">{products.length}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Top Rated Products</h3>
        <div className="space-y-3">
          {topProducts.map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div className="font-medium">{product.title}</div>
                  <div className="text-sm text-gray-500">
                    ⭐ {product.ratingAvg.toFixed(1)} ({product.ratingCount} reviews)
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
  );
};

export default SellerDashboard;