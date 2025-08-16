import React from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../data/mockData';
import ProductGrid from '../Product/ProductGrid';

const FeaturedProducts: React.FC = () => {
  const allProducts = getProducts();
  const featuredProducts = allProducts
    .filter(p => p.isActive)
    .sort((a, b) => b.ratingAvg - a.ratingAvg)
    .slice(0, 8);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of trending products from top-rated sellers
          </p>
        </div>

        <ProductGrid products={featuredProducts} />

        <div className="text-center mt-12">
          <Link
            to="/search"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Products
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;