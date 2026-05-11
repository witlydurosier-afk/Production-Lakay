import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { normalizeProductName } from '../lib/productText';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lakay_cart');
    if (!saved) return [];

    return (JSON.parse(saved) as CartItem[]).map((item) => ({
      ...item,
      name: normalizeProductName(item.name)
    }));
  });

  useEffect(() => {
    localStorage.setItem('lakay_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'id' | 'quantity'>) => {
    setItems(prev => {
      const existingId = newItem.selectedVariation 
        ? `${newItem.productId}-${newItem.selectedVariation}`
        : newItem.productId;
      
      const existing = prev.find(i => i.id === existingId);
      
      if (existing) {
        return prev.map(i => i.id === existingId 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      
      return [...prev, { ...newItem, id: existingId, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
