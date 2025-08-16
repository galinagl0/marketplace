import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { getProducts } from '../data/mockData';

interface CartContextType {
  items: CartItem[];
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  cartTotal: number;
  itemCount: number;
  getCartProducts: () => (CartItem & { product: Product })[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { currentUser } = useAuth();

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (currentUser?.role === 'CUSTOMER') {
      const stored = localStorage.getItem(`cart_${currentUser.id}`);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [currentUser]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (currentUser?.role === 'CUSTOMER') {
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(items));
    }
  }, [items, currentUser]);

  const add = (productId: string, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { productId, qty }];
    });
  };

  const remove = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const setQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      remove(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, qty } : item
      )
    );
  };

  const clear = () => {
    setItems([]);
  };

  const getCartProducts = () => {
    const products = getProducts();
    return items.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId)!
    })).filter(item => item.product);
  };

  const cartTotal = getCartProducts().reduce(
    (sum, item) => sum + (item.product.price * item.qty), 0
  );

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{
      items,
      add,
      remove,
      setQty,
      clear,
      cartTotal,
      itemCount,
      getCartProducts
    }}>
      {children}
    </CartContext.Provider>
  );
};