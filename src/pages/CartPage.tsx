import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { getCartProducts, setQty, remove, cartTotal, clear } = useCart();
  const cartProducts = getCartProducts();

  if (cartProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link
          to="/"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartProducts.map((item) => (
            <div key={item.productId} className="bg-white border rounded-lg p-6">
              <div className="flex space-x-4">
                <Link to={`/product/${item.productId}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/product/${item.productId}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    ${item.product.price}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQty(item.productId, item.qty - 1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.productId, item.qty + 1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </span>
                      <button
                        onClick={() => remove(item.productId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cartProducts.reduce((sum, item) => sum + item.qty, 0)} items)</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={clear}
                className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;