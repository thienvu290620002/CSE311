// WishlistContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishItems, setWishItems] = useState([]);

  // Lấy wishlist từ localStorage khi component được mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Lưu wishlist vào localStorage khi wishItems thay đổi
  useEffect(() => {
    if (wishItems.length > 0) {
      localStorage.setItem("wishlist", JSON.stringify(wishItems));
    }
  }, [wishItems]);

  const addToWishlist = (product) => {
    setWishItems((prevItems) => {
      if (!prevItems.find((item) => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishItems, setWishItems, addToWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
