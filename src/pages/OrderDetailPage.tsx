import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { getOrders, getProducts, getUsers } from '../data/mockData';
import { useAuth, RequireAuth } from '../context/AuthContext';
import { Order } from '../types';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id && currentUser) {
      const orders = getOrders();
      const foundOrder = orders.find((o: Order) => o.id === id && o.customerId === currentUser.id);
      setOrder(foundOrder || null);
    }
  }, [id, currentUser]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <Link to="/orders" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const products = getProducts();
  const users = getUsers();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAID': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: Calendar },
    { key: 'PAID', label: 'Payment Confirmed', icon: CreditCard },
    { key: 'SHIPPED', label: 'Shipped', icon: Package },
    { key: 'DELIVERED', label: 'Delivered', icon: MapPin }
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  return (
    <RequireAuth roles={['CUSTOMER']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/orders"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Timeline */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Order Status</h2>
              <div className="relative">
                {statusSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.key} className="flex items-center mb-6 last:mb-0">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isCompleted 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </div>
                        {isCurrent && (
                          <div className="text-sm text-blue-600">Current status</div>
                        )}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`absolute left-5 w-0.5 h-6 ${
                          index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`} style={{ top: `${(index + 1) * 64 - 32}px` }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items by Seller */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.sellerBreakdown.map((breakdown) => {
                  const seller = users.find(u => u.id === breakdown.sellerId);
                  return (
                    <div key={breakdown.sellerId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900">
                          Sold by {seller?.name || 'Unknown Seller'}
                        </h3>
                        <span className="font-bold">${breakdown.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="space-y-3">
                        {breakdown.items.map((item) => {
                          const product = products.find(p => p.id === item.productId);
                          return product ? (
                            <div key={item.productId} className="flex items-center space-x-4">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <Link
                                  to={`/product/${product.id}`}
                                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                  {product.title}
                                </Link>
                                <div className="text-sm text-gray-500">
                                  {product.brand} • Qty: {item.qty}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${product.price}</div>
                                <div className="text-sm text-gray-500">
                                  Total: ${(product.price * item.qty).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{order.items.reduce((sum, item) => sum + item.qty, 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total Amount</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Delivery Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="font-medium">{order.address.fullName}</div>
                  <div>{order.address.phone}</div>
                  <div>{order.address.street}</div>
                  <div>{order.address.city}, {order.address.postalCode}</div>
                  <div>{order.address.country}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default OrderDetailPage;