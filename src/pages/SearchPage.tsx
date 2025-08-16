import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../data/mockData';
import ProductGrid from '../components/Product/ProductGrid';
import ProductFilters, { FilterState } from '../components/Filters/ProductFilters';
import { Product } from '../types';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceMin: 0,
    priceMax: 10000,
    brand: '',
    rating: 0,
    seller: '',
    sortBy: 'newest'
  });

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const allProducts = getProducts().filter(p => p.isActive);
    let filtered = allProducts;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }

    if (filters.seller) {
      filtered = filtered.filter(p => p.sellerId === filters.seller);
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.ratingAvg >= filters.rating);
    }

    filtered = filtered.filter(p => 
      p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
      case 'popular':
        filtered.sort((a, b) => b.ratingCount - a.ratingCount);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} products found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters onFiltersChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;