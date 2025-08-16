import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">UzumMarket</h3>
            <p className="text-gray-300 mb-4">
              Your trusted marketplace for quality products from verified sellers worldwide.
            </p>
            <div className="flex space-x-4">
              <button className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 bg-blue-400 rounded-full hover:bg-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 bg-pink-600 rounded-full hover:bg-pink-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/track" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" />
                <span>+998 90 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>support@uzummarket.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <span>Tashkent, Uzbekistan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 UzumMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;