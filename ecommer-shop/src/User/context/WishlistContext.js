// // WishlistContext.js
// import React, { createContext, useState, useContext, useEffect } from "react";

// const WishlistContext = createContext();

// export const useWishlist = () => {
//   return useContext(WishlistContext);
// };

// export const WishlistProvider = ({ children }) => {
//   const [wishItems, setWishItems] = useState([]);

//   // Lấy wishlist từ localStorage khi component được mount
//   // useEffect(() => {
//   //   const savedWishlist = localStorage.getItem("wishlist");
//   //   if (savedWishlist) {
//   //     setWishItems(JSON.parse(savedWishlist));
//   //   }
//   // }, []);
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/get-wishlist-by-userId?id=${userId}`
//         );

//         if (response.data.data && response.data.data.wishlist) {
//           setWishItems(response.data.data.wishlist);
//           localStorage.setItem(
//             "wishlist",
//             JSON.stringify(response.data.data.wishlist)
//           ); // <-- lưu luôn
//         } else {
//           setWishItems([]);
//           localStorage.removeItem("wishlist"); // hoặc xóa đi
//         }
//       } catch (error) {
//         console.error("Failed to fetch wishlist:", error);
//         setWishItems([]);
//         localStorage.removeItem("wishlist");
//       }
//     };
//     // console.log(wishItems);

//     if (userId) {
//       fetchWishlist();
//     }
//   }, [userId, setWishItems]);

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
import axios from "axios"; // bạn quên import axios trong file này

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishItems, setWishItems] = useState([]);

  // Lấy userId từ localStorage (hoặc bạn có thể lấy từ context auth nếu có)
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.id) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  // Fetch wishlist từ API khi có userId
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/get-wishlist-by-userId?id=${userId}`
        );

        if (response.data.data && response.data.data.wishlist) {
          setWishItems(response.data.data.wishlist);
          localStorage.setItem(
            "wishlist",
            JSON.stringify(response.data.data.wishlist)
          );
        } else {
          setWishItems([]);
          localStorage.removeItem("wishlist");
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setWishItems([]);
        localStorage.removeItem("wishlist");
      }
    };

    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  // Lưu wishlist vào localStorage khi wishItems thay đổi (không cần kiểm tra length > 0, có thể lưu mảng rỗng)
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

  return (
    <WishlistContext.Provider
      value={{ wishItems, setWishItems, addToWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
