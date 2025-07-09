import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem("cart");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const exist = prevItems.find((x) => x.id === product.id);
      if (exist) {
        return prevItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.id !== productId));
  };

  
  const updateCartItemQty = (productId, newQty) => {
   
    const quantity = Math.max(1, newQty);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, qty: quantity } : item
      )
    );
  };
 

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemQty, 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
