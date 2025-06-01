import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishItems, setWishItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // // Lấy userId khi component mount
  // useEffect(() => {
  //   const userString = localStorage.getItem("user");
  //   if (userString) {
  //     try {
  //       const user = JSON.parse(userString);
  //       if (user && user.id) setUserId(user.id);
  //       fetchWishlist(user.id);
  //     } catch (error) {
  //       console.error("Error parsing user from localStorage", error);
  //     }
  //   }
  // }, []);

  // Hàm fetch wishlist từ backend, dùng useCallback để không bị tạo lại mỗi render
  // const fetchWishlist = useCallback(async () => {
  //   if (!userId) return;
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8080/api/get-wishlist-by-userId?id=${userId}`
  //     );
  //     if (response.data.data && response.data.data.wishlist) {
  //       setWishItems(response.data.data.wishlist);
  //     } else {
  //       setWishItems([]);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch wishlist:", error);
  //     setWishItems([]);
  //   }
  // }, [userId]);
  const fetchWishlist = useCallback(
    async (uid = userId) => {
      if (!uid) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/get-wishlist-by-userId?id=${uid}`
        );
        if (response.data.data && response.data.data.wishlist) {
          setWishItems(response.data.data.wishlist);
        } else {
          setWishItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setWishItems([]);
      }
    },
    [userId]
  );
  // Lấy userId khi component mount
  // useEffect(() => {
  //   const userString = localStorage.getItem("user");
  //   if (userString) {
  //     try {
  //       const user = JSON.parse(userString);
  //       if (user && user.id) setUserId(user.id);
  //     } catch (error) {
  //       console.error("Error parsing user from localStorage", error);
  //     }
  //   }
  // }, []);
  // Lấy userId khi component mount
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.id) setUserId(user.id);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  // Khi userId thay đổi, fetch lại wishlist
  useEffect(() => {
    if (userId) fetchWishlist(userId);
  }, [userId, fetchWishlist]);
  // Lưu wishlist vào localStorage mỗi khi wishItems thay đổi (nếu cần)
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishItems));
  }, [wishItems]);

  // Kiểm tra sản phẩm có trong wishlist hay không (so sánh với productId đúng)
  const isInWishlist = (productId) => {
    return wishItems.some(
      (item) => item.productId?.toString() === productId?.toString()
    );
  };

  // Thêm product vào wishlist, gọi API và cập nhật lại state
  const addToWishlist = async (product) => {
    if (!userId) return;
    try {
      await axios.post("http://localhost:8080/api/create-wishlist", {
        userId,
        productId: product.productId,
      });
      await fetchWishlist();
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  };

  // Xóa product khỏi wishlist, gọi API và cập nhật lại state
  const removeFromWishlist = async (productId) => {
    if (!userId) return;
    try {
      await axios.get("http://localhost:8080/api/delete-wishlist", {
        params: { userId, productId },
      });
      await fetchWishlist();
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  // Chuyển đổi trạng thái wishlist (thêm hoặc xóa)
  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };
  const loginUser = useCallback(
    (user) => {
      setUserId(user.id);
      fetchWishlist(user.id);
    },
    [fetchWishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishItems,
        setWishItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        loginUser,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
