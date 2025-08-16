import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RequireAuth } from '../context/AuthContext';
import { getOrders, setOrders, getUsers } from '../data/mockData';
import { Order, Address } from '../types';

const CheckoutPage: React.FC = () => {
  const { getCartProducts, cartTotal, clear } = useCart();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const cartProducts = getCartProducts();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const [address, setAddress] = useState<Address>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Uzbekistan'
  });

  const deliveryFee = deliveryOption === 'express' ? 15 : 0;
  const finalTotal = cartTotal + deliveryFee;

  // Group items by seller
  const sellerBreakdown = cartProducts.reduce((acc, item) => {
    const sellerId = item.product.sellerId;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerId,
        subtotal: 0,
        items: []
      };
    }
    acc[sellerId].subtotal += item.product.price * item.qty;
    acc[sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { sellerId: string; subtotal: number; items: any[] }>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate address
    if (!address.fullName || !address.phone || !address.street || !address.city) {
      addToast('error', 'Please fill in all required address fields');
      setLoading(false);
      return;
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        customerId: currentUser!.id,
        items: cartProducts.map(item => ({
          productId: item.productId,
          qty: item.qty
        })),
        total: finalTotal,
        status: paymentMethod === 'card' ? 'PAID' : 'PENDING',
        address,
        createdAt: new Date().toISOString(),
        sellerBreakdown: Object.values(sellerBreakdown)
      };

      const orders = getOrders();
      setOrders([...orders, newOrder]);

      // Clear cart
      clear();

      addToast('success', 'Order placed successfully!');
      navigate(`/orders/${newOrder.id}`);
    } catch (error) {
      addToast('error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth roles={['CUSTOMER']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <MapPin className="mr-2 w-6 h-6" />
                Delivery Address
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Kyrgyzstan">Kyrgyzstan</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Delivery Options */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Truck className="mr-2 w-6 h-6" />
                Delivery Options
              </h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliveryOption === 'standard'}
                    onChange={(e) => setDeliveryOption(e.target.value as 'standard')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Standard Delivery (3-5 days)</div>
                    <div className="text-sm text-gray-500">Free delivery</div>
                  </div>
                  <div className="font-bold text-green-600">Free</div>
                </label>
                
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={deliveryOption === 'express'}
                    onChange={(e) => setDeliveryOption(e.target.value as 'express')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Express Delivery (1 day)</div>
                    <div className="text-sm text-gray-500">Next day delivery</div>
                  </div>
                  <div className="font-bold">$15</div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <CreditCard className="mr-2 w-6 h-6" />
                Payment Method
              </h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">Pay securely with your card</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when you receive your order</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartProducts.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium truncate">{item.product.title}</div>
                      <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                    </div>
                    <div className="font-medium">
                      ${(item.product.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || cartProducts.length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
              >
                {loading ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default CheckoutPage;