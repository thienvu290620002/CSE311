<<<<<<< HEAD
// import React, { createContext, useContext, useState } from "react";
// import { toast } from "react-toastify"; // Ensure proper import
// import "react-toastify/dist/ReactToastify.css"; // Ensure styles are imported

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   const addToCart = (product) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find((item) => item.id === product.id);
//       const toastId = "cart-toast"; // Unique ID for the toast

//       // Check if the toast with this ID is already active
//       if (toast.isActive(toastId)) {
//         return prevItems; // Don't show toast again if active
//       }

//       if (existingItem) {
//         toast.success("Quantity updated in cart successfully!", {
//           position: "top-right",
//           autoClose: 1000,
//           toastId, // Pass the unique ID
//         });
//         return prevItems.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         toast.success("Added to cart successfully!", {
//           position: "top-right",
//           autoClose: 1000,
//           toastId, // Pass the unique ID
//         });
//         return [...prevItems, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, setCartItems, addToCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Lấy cartItems từ localStorage lúc khởi tạo, nếu không có thì là []
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
<<<<<<< HEAD

  // Lưu cartItems vào localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8

  // Lưu cartItems vào localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // const addToCart = (product) => {
  //   setCartItems((prevItems) => {
  //     const existingItem = prevItems.find((item) => item.id === product.id);
  //     const toastId = "cart-toast";

  //     if (toast.isActive(toastId)) {
  //       return prevItems;
  //     }

  //     if (existingItem) {
  //       toast.success("Quantity updated in cart successfully!", {
  //         position: "top-right",
  //         autoClose: 1000,
  //         toastId,
  //       });
  //       return prevItems.map((item) =>
  //         item.id === product.id
  //           ? { ...item, quantity: item.quantity + 1 }
  //           : item,
  //       );
  //     } else {
  //       toast.success("Added to cart successfully!", {
  //         position: "top-right",
  //         autoClose: 1000,
  //         toastId,
  //       });
  //       return [...prevItems, { ...product, quantity: 1 }];
  //     }
  //   });
  // };
  const addToCart = (product) => {
<<<<<<< HEAD
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const toastId = "cart-toast";

      if (toast.isActive(toastId)) {
        return prevItems;
      }

      if (existingItem) {
        toast.success("Quantity updated in cart successfully!", {
          position: "bottom-right",
          autoClose: 1000,
          toastId,
        });
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast.success("Added to cart successfully!", {
          position: "bottom-right",
          autoClose: 1000,
          toastId,
        });
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
=======
  const quantityToAdd = parseInt(product.quantity, 10) || 1;

  setCartItems((prevItems) => {
    const existingItem = prevItems.find((item) => item.id === product.id);
    const toastId = "cart-toast";

    if (toast.isActive(toastId)) {
      return prevItems;
    }

    if (existingItem) {
      toast.success("Quantity updated in cart successfully!", {
        position: "top-right",
        autoClose: 1000,
        toastId,
      });

      return prevItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      );
    } else {
      toast.success("Added to cart successfully!", {
        position: "top-right",
        autoClose: 1000,
        toastId,
      });

      return [...prevItems, { ...product, quantity: quantityToAdd }];
    }
  });
};


>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
