export type Role = 'ADMIN' | 'SELLER' | 'CUSTOMER';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  password: string; // plaintext for demo
  phone?: string;
  avatarUrl?: string;
  isApproved?: boolean; // for sellers
  isBlocked?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  parentId?: string | null;
  imageUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  brand: string;
  sellerId: string;
  stock: number;
  ratingAvg: number;
  ratingCount: number;
  categoryId: string;
  createdAt: string;
  isActive?: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  address: Address;
  createdAt: string;
  sellerBreakdown: Array<{
    sellerId: string;
    subtotal: number;
    items: CartItem[];
  }>;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface WishlistItem {
  productId: string;
  customerId: string;
  createdAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}