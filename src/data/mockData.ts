import { User, Category, Product, Role } from '../types';

// Demo users
export const demoUsers: User[] = [
  {
    id: 'admin-1',
    role: 'ADMIN',
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    phone: '+1234567890',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seller-1',
    role: 'SELLER',
    name: 'John Seller',
    email: 'seller@demo.com',
    password: 'seller123',
    phone: '+1234567891',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'customer-1',
    role: 'CUSTOMER',
    name: 'Jane Customer',
    email: 'customer@demo.com',
    password: 'customer123',
    phone: '+1234567892',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date().toISOString()
  }
];

// Categories
export const demoCategories: Category[] = [
  { id: 'cat-1', name: 'Electronics', icon: '📱', parentId: null, imageUrl: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg' },
  { id: 'cat-1-1', name: 'Smartphones', parentId: 'cat-1' },
  { id: 'cat-1-2', name: 'Laptops', parentId: 'cat-1' },
  { id: 'cat-1-3', name: 'Headphones', parentId: 'cat-1' },
  
  { id: 'cat-2', name: 'Fashion', icon: '👕', parentId: null, imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg' },
  { id: 'cat-2-1', name: 'Men\'s Clothing', parentId: 'cat-2' },
  { id: 'cat-2-2', name: 'Women\'s Clothing', parentId: 'cat-2' },
  { id: 'cat-2-3', name: 'Shoes', parentId: 'cat-2' },
  
  { id: 'cat-3', name: 'Home & Garden', icon: '🏠', parentId: null, imageUrl: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg' },
  { id: 'cat-3-1', name: 'Furniture', parentId: 'cat-3' },
  { id: 'cat-3-2', name: 'Kitchen', parentId: 'cat-3' },
  
  { id: 'cat-4', name: 'Sports', icon: '⚽', parentId: null, imageUrl: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg' },
  { id: 'cat-4-1', name: 'Fitness Equipment', parentId: 'cat-4' },
  { id: 'cat-4-2', name: 'Sportswear', parentId: 'cat-4' }
];

// Products
export const demoProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography and professional use.',
    price: 1199,
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg'
    ],
    brand: 'Apple',
    sellerId: 'seller-1',
    stock: 15,
    ratingAvg: 4.8,
    ratingCount: 124,
    categoryId: 'cat-1-1',
    createdAt: '2024-01-15T10:00:00Z',
    isActive: true
  },
  {
    id: 'prod-2',
    title: 'MacBook Pro 16"',
    description: 'Powerful laptop with M3 chip, 32GB RAM, and 1TB SSD. Perfect for developers and creators.',
    price: 2499,
    images: [
      'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg',
      'https://images.pexels.com/photos/18105/pexels-photo.jpg'
    ],
    brand: 'Apple',
    sellerId: 'seller-1',
    stock: 8,
    ratingAvg: 4.9,
    ratingCount: 89,
    categoryId: 'cat-1-2',
    createdAt: '2024-01-10T10:00:00Z',
    isActive: true
  },
  {
    id: 'prod-3',
    title: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.',
    price: 399,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
    ],
    brand: 'Sony',
    sellerId: 'seller-1',
    stock: 25,
    ratingAvg: 4.7,
    ratingCount: 156,
    categoryId: 'cat-1-3',
    createdAt: '2024-01-08T10:00:00Z',
    isActive: true
  },
  {
    id: 'prod-4',
    title: 'Premium Cotton T-Shirt',
    description: 'Comfortable and stylish cotton t-shirt available in multiple colors. Perfect for casual wear.',
    price: 29,
    images: [
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
      'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg'
    ],
    brand: 'FashionHub',
    sellerId: 'seller-1',
    stock: 50,
    ratingAvg: 4.3,
    ratingCount: 78,
    categoryId: 'cat-2-1',
    createdAt: '2024-01-12T10:00:00Z',
    isActive: true
  },
  {
    id: 'prod-5',
    title: 'Wireless Gaming Mouse',
    description: 'High-precision wireless gaming mouse with RGB lighting and programmable buttons.',
    price: 79,
    images: [
      'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg'
    ],
    brand: 'TechGear',
    sellerId: 'seller-1',
    stock: 30,
    ratingAvg: 4.5,
    ratingCount: 92,
    categoryId: 'cat-1',
    createdAt: '2024-01-05T10:00:00Z',
    isActive: true
  },
  {
    id: 'prod-6',
    title: 'Modern Desk Lamp',
    description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging port.',
    price: 89,
    images: [
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg'
    ],
    brand: 'HomeLight',
    sellerId: 'seller-1',
    stock: 20,
    ratingAvg: 4.6,
    ratingCount: 45,
    categoryId: 'cat-3-2',
    createdAt: '2024-01-03T10:00:00Z',
    isActive: true
  }
];

// LocalStorage helpers
export const getUsers = (): User[] => {
  const stored = localStorage.getItem('users');
  return stored ? JSON.parse(stored) : demoUsers;
};

export const setUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getCategories = (): Category[] => {
  const stored = localStorage.getItem('categories');
  return stored ? JSON.parse(stored) : demoCategories;
};

export const setCategories = (categories: Category[]): void => {
  localStorage.setItem('categories', JSON.stringify(categories));
};

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : demoProducts;
};

export const setProducts = (products: Product[]): void => {
  localStorage.setItem('products', JSON.stringify(products));
};

export const getOrders = () => {
  const stored = localStorage.getItem('orders');
  return stored ? JSON.parse(stored) : [];
};

export const setOrders = (orders: any[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getReviews = () => {
  const stored = localStorage.getItem('reviews');
  return stored ? JSON.parse(stored) : [];
};

export const setReviews = (reviews: any[]) => {
  localStorage.setItem('reviews', JSON.stringify(reviews));
};

export const getWishlist = (customerId: string) => {
  const stored = localStorage.getItem(`wishlist_${customerId}`);
  return stored ? JSON.parse(stored) : [];
};

export const setWishlist = (customerId: string, wishlist: any[]) => {
  localStorage.setItem(`wishlist_${customerId}`, JSON.stringify(wishlist));
};

// Initialize data on first load
export const initializeData = () => {
  if (!localStorage.getItem('users')) {
    setUsers(demoUsers);
  }
  if (!localStorage.getItem('categories')) {
    setCategories(demoCategories);
  }
  if (!localStorage.getItem('products')) {
    setProducts(demoProducts);
  }
};