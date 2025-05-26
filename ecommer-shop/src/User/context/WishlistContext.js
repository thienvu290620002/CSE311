// // WishlistContext.js
// import React, { createContext, useState, useContext, useEffect } from "react";

// const WishlistContext = createContext();

// export const useWishlist = () => {
//   return useContext(WishlistContext);
// };

// export const WishlistProvider = ({ children }) => {
//   const [wishItems, setWishItems] = useState([]);

//   // Lấy wishlist từ localStorage khi component được mount
//   useEffect(() => {
//     const savedWishlist = localStorage.getItem("wishlist");
//     if (savedWishlist) {
//       setWishItems(JSON.parse(savedWishlist));
//     }
//   }, []);

//   // Lưu wishlist vào localStorage khi wishItems thay đổi
//   useEffect(() => {
//     if (wishItems.length > 0) {
//       localStorage.setItem("wishlist", JSON.stringify(wishItems));
//     }
//   }, [wishItems]);

//   const addToWishlist = (product) => {
//     setWishItems((prevItems) => {
//       if (!prevItems.find((item) => item.id === product.id)) {
//         return [...prevItems, product];
//       }
//       return prevItems;
//     });
//   };

//   return (
//     <WishlistContext.Provider
//       value={{ wishItems, setWishItems, addToWishlist }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };
import React, { createContext, useState, useContext, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishItems, setWishItems] = useState([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishItems(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishItems));
  }, [wishItems]);

  const addToWishlist = (product) => {
    setWishItems((prevItems) => {
      if (!prevItems.find((item) => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  const isInWishlist = (productId) => {
    return wishItems.some((item) => item.id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishItems,
        setWishItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
