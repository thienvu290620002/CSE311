import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify"; // Ensure proper import
import "react-toastify/dist/ReactToastify.css"; // Ensure styles are imported

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const toastId = "cart-toast"; // Unique ID for the toast

      // Check if the toast with this ID is already active
      if (toast.isActive(toastId)) {
        return prevItems; // Don't show toast again if active
      }

      if (existingItem) {
        toast.success("Quantity updated in cart successfully!", {
          position: "top-right",
          autoClose: 1000,
          toastId, // Pass the unique ID
        });
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast.success("Added to cart successfully!", {
          position: "top-right",
          autoClose: 1000,
          toastId, // Pass the unique ID
        });
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
