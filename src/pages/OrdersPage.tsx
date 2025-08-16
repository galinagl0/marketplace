import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, Truck } from 'lucide-react';
import { useAuth, RequireAuth } from '../context/AuthContext';
import { getOrders, getProducts } from '../data/mockData';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (currentUser) {
      const allOrders = getOrders();
      const userOrders = allOrders.filter((order: Order) => order.customerId === currentUser.id);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [currentUser]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return <Calendar className="w-4 h-4" />;
      case 'PAID': return <DollarSign className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'DELIVERED': return <Package className="w-4 h-4" />;
      case 'CANCELLED': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <RequireAuth roles={['CUSTOMER']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
            <Link
              to="/"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                    <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item) => {
                        const products = getProducts();
                        const product = products.find(p => p.id === item.productId);
                        return product ? (
                          <div key={item.productId} className="flex items-center space-x-3">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{product.title}</div>
                              <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                            </div>
                          </div>
                        ) : null;
                      })}
                      {order.items.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                    <div className="text-sm text-gray-600">
                      <div>{order.address.fullName}</div>
                      <div>{order.address.street}</div>
                      <div>{order.address.city}, {order.address.postalCode}</div>
                      <div>{order.address.country}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {order.sellerBreakdown.length} seller(s)
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
};

export default OrdersPage;