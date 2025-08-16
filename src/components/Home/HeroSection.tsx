import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Users, Star, Truck } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span className="block text-yellow-400">Products</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-lg">
              Shop from thousands of verified sellers worldwide. Find exactly what you're looking for at the best prices with fast delivery.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Link
                to="/search"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Start Shopping
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/seller"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                Become a Seller
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg"
              alt="Shopping Experience"
              className="rounded-lg shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <Truck className="w-6 h-6" />
                <div>
                  <h4 className="font-bold">Free Delivery</h4>
                  <p className="text-sm">On orders over $50</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <h3 className="text-2xl font-bold">1000+</h3>
            <p className="text-blue-200">Products</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <Users className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-blue-200">Sellers</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <h3 className="text-2xl font-bold">50K+</h3>
            <p className="text-blue-200">Happy Customers</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <Truck className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <h3 className="text-2xl font-bold">24/7</h3>
            <p className="text-blue-200">Fast Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;