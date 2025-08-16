import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { getCategories, getProducts, getUsers } from '../../data/mockData';

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
  priceMin: number;
  priceMax: number;
  brand: string;
  rating: number;
  seller: string;
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'popular';
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFiltersChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    priceMin: Number(searchParams.get('priceMin')) || 0,
    priceMax: Number(searchParams.get('priceMax')) || 10000,
    brand: searchParams.get('brand') || '',
    rating: Number(searchParams.get('rating')) || 0,
    seller: searchParams.get('seller') || '',
    sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'newest'
  });

  const categories = getCategories();
  const products = getProducts();
  const users = getUsers();
  
  const availableBrands = [...new Set(products.map(p => p.brand))].sort();
  const sellers = users.filter(u => u.role === 'SELLER');

  useEffect(() => {
    onFiltersChange(filters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 0 && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, onFiltersChange, setSearchParams]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      category: '',
      priceMin: 0,
      priceMax: 10000,
      brand: '',
      rating: 0,
      seller: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filters & Sort</span>
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white h-full w-80 max-w-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterContent
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              categories={categories}
              availableBrands={availableBrands}
              sellers={sellers}
            />
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border p-6 sticky top-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear All
          </button>
        </div>
        <FilterContent
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          categories={categories}
          availableBrands={availableBrands}
          sellers={sellers}
        />
      </div>
    </>
  );
};

const FilterContent: React.FC<{
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onClearFilters: () => void;
  categories: any[];
  availableBrands: string[];
  sellers: any[];
}> = ({ filters, onFilterChange, categories, availableBrands, sellers }) => {
  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => onFilterChange('priceMin', Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded text-sm"
              placeholder="Min"
              min="0"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => onFilterChange('priceMax', Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded text-sm"
              placeholder="Max"
              min="0"
            />
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            value={filters.priceMax}
            onChange={(e) => onFilterChange('priceMax', Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600">
            ${filters.priceMin} - ${filters.priceMax}
          </div>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="font-semibold mb-3">Brand</h3>
        <select
          value={filters.brand}
          onChange={(e) => onFilterChange('brand', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Brands</option>
          {availableBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={() => onFilterChange('rating', rating)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-1 text-sm">& above</span>
              </div>
            </label>
          ))}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={0}
              checked={filters.rating === 0}
              onChange={() => onFilterChange('rating', 0)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">All ratings</span>
          </label>
        </div>
      </div>

      {/* Seller */}
      <div>
        <h3 className="font-semibold mb-3">Seller</h3>
        <select
          value={filters.seller}
          onChange={(e) => onFilterChange('seller', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sellers</option>
          {sellers.map(seller => (
            <option key={seller.id} value={seller.id}>{seller.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;