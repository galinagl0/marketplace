import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getWishlist, setWishlist } from '../../data/mockData';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { add } = useCart();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'CUSTOMER') {
      const wishlist = getWishlist(currentUser.id);
      setIsWishlisted(wishlist.some((item: any) => item.productId === product.id));
    }
  }, [currentUser, product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      addToast('error', 'Please log in to add items to cart');
      return;
    }
    
    if (currentUser.role !== 'CUSTOMER') {
      addToast('error', 'Only customers can add items to cart');
      return;
    }

    if (product.stock <= 0) {
      addToast('error', 'Product is out of stock');
      return;
    }

    add(product.id, 1);
    addToast('success', 'Added to cart!');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser || currentUser.role !== 'CUSTOMER') {
      addToast('error', 'Please log in as a customer to use wishlist');
      return;
    }

    const wishlist = getWishlist(currentUser.id);
    
    if (isWishlisted) {
      const updated = wishlist.filter((item: any) => item.productId !== product.id);
      setWishlist(currentUser.id, updated);
      setIsWishlisted(false);
      addToast('info', 'Removed from wishlist');
    } else {
      const updated = [...wishlist, {
        productId: product.id,
        customerId: currentUser.id,
        createdAt: new Date().toISOString()
      }];
      setWishlist(currentUser.id, updated);
      setIsWishlisted(true);
      addToast('success', 'Added to wishlist!');
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group border overflow-hidden">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button 
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
          </button>
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              Out of Stock
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.ratingAvg.toFixed(1)} ({product.ratingCount})
              </span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            <span>Stock: {product.stock}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;