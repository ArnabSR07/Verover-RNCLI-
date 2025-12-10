import React, { createContext, useContext, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

type CartContextType = {
  cart: CartItem[];
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<CartItem[]>([]);

 const addToCart = (item) => {
  setCart(prev => {
    const exists = prev.find(x => x.id === item.id);

    if (exists) {
      return prev.map(x =>
        x.id === item.id
          ? { ...x, quantity: (x.quantity || 0) + 1 }
          : x
      );
    }

    return [...prev, { ...item, quantity: 1 }];
  });
};

  const removeFromCart = (id) => {
  setCart(prev => {
    const exists = prev.find(x => x.id === id);
    if (!exists) return prev;

    if (exists.quantity <= 1) {
      return prev.filter(x => x.id !== id);
    }

    return prev.map(x =>
      x.id === id
        ? { ...x, quantity: x.quantity - 1 }
        : x
    );
  });
};

  const clearCart = () => setCart([]);

  const total = cart.reduce(
  (sum, item) => sum + item.price * (item.quantity || 1),
  0
);

  return (
    <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
