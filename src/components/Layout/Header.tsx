import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getCategories } from '../../data/mockData';
import AuthModal from '../Auth/AuthModal';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const categories = getCategories().filter(cat => !cat.parentId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        {/* Top bar */}
        <div className="bg-blue-600 text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>Free delivery on orders over $50</span>
              <span>•</span>
              <span>24/7 Customer Support</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-md shadow-lg py-1">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">English</button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Русский</button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">O'zbek</button>
                  </div>
                )}
              </div>
              <span>USD</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button className="lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                UzumMarket
              </Link>
            </div>

            {/* Categories */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showCategoryMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowCategoryMenu(false)}
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-6 h-6 text-gray-600" />
                    )}
                    <span className="hidden md:block text-sm font-medium">{currentUser.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                        <p className="text-xs text-blue-600 capitalize">{currentUser.role.toLowerCase()}</p>
                      </div>
                      <Link
                        to="/orders"
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      {currentUser.role === 'SELLER' && (
                        <Link
                          to="/seller"
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Seller Dashboard
                        </Link>
                      )}
                      {currentUser.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default Header;