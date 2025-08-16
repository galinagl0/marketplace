import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts, getCategories } from '../data/mockData';
import ProductGrid from '../components/Product/ProductGrid';
import ProductFilters, { FilterState } from '../components/Filters/ProductFilters';
import { Product, Category } from '../types';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: id || '',
    priceMin: 0,
    priceMax: 10000,
    brand: '',
    rating: 0,
    seller: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    const categories = getCategories();
    const foundCategory = categories.find(cat => cat.id === id);
    setCategory(foundCategory || null);
    
    // Update filters when category changes
    setFilters(prev => ({ ...prev, category: id || '' }));
  }, [id]);

  useEffect(() => {
    const allProducts = getProducts().filter(p => p.isActive);
    let filtered = allProducts;

    // Get all subcategory IDs for this category
    const categories = getCategories();
    const subcategoryIds = categories
      .filter(cat => cat.parentId === id)
      .map(cat => cat.id);
    
    // Filter by category and subcategories
    if (id) {
      filtered = filtered.filter(p => 
        p.categoryId === id || subcategoryIds.includes(p.categoryId)
      );
    }

    // Apply other filters
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
  }, [id, filters]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-600">{filteredProducts.length} products available</p>
          </div>
        </div>
        
        {category.imageUrl && (
          <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
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

export default CategoryPage;