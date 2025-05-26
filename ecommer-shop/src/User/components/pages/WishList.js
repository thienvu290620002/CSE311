// import React, { useEffect } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import swal from "sweetalert";
<<<<<<< HEAD
// import axios from "axios";
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8

const WishList = () => {
  const { wishItems, setWishItems } = useWishlist();
  const { cartItems, setCartItems } = useCart();
<<<<<<< HEAD

  // ✅ Giả sử userId được lưu trong localStorage
  // const userString = localStorage.getItem("user");

  // let userId = null;
  // if (userString) {
  //   try {
  //     const user = JSON.parse(userString); // 👉 Parse chuỗi JSON thành object
  //     userId = user.id; // Bây giờ bạn có thể dùng user.id
  //   } catch (e) {
  //     console.error("Lỗi khi parse user từ localStorage:", e);
  //   }
  // }

  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8080/api/get-wishlist-by-userId?id=${userId}`
  //       );

  //       // Giả sử API trả về mảng sản phẩm
  //       if (response.data.data && response.data.data.wishlist) {
  //         setWishItems(response.data.data.wishlist); // ✅ Dữ liệu đúng dạng
  //         console.log(response.data.data.wishlist, "agdfhgdhm");
  //       } else {
  //         setWishItems([]);
  //       }
  //       console.log(wishItems);
  //     } catch (error) {
  //       console.error("Failed to fetch wishlist:", error);
  //       setWishItems([]);
  //     }
  //   };

  //   if (userId) {
  //     fetchWishlist();
  //   }
  // }, [userId, setWishItems]);
  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8080/api/get-wishlist-by-userId?id=${userId}`
  //       );

  //       if (response.data.data && response.data.data.wishlist) {
  //         setWishItems(response.data.data.wishlist);
  //         localStorage.setItem(
  //           "wishlist",
  //           JSON.stringify(response.data.data.wishlist)
  //         ); // <-- lưu luôn
  //       } else {
  //         setWishItems([]);
  //         localStorage.removeItem("wishlist"); // hoặc xóa đi
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch wishlist:", error);
  //       setWishItems([]);
  //       localStorage.removeItem("wishlist");
  //     }
  //   };
  //   // console.log(wishItems);

  //   if (userId) {
  //     fetchWishlist();
  //   }
  // }, [userId, setWishItems]);
  console.log(wishItems);
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8

  const removeFromWishlist = (productId) => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to remove this item from your wishlist?",
      icon: "warning",
      buttons: ["Cancel", "Yes, remove it"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setWishItems((prevItems) =>
<<<<<<< HEAD
          prevItems.filter((item) => item.id !== productId)
=======
          prevItems.filter((item) => item.id !== productId),
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
        );

        swal("Removed!", "The item has been removed from your wishlist.", {
          icon: "success",
        });
      } else {
        swal("Cancelled", "The item is still in your wishlist.");
      }
    });
  };

  const addToCartFromWishlist = (item) => {
    const exists = cartItems.find((cartItem) => cartItem.id === item.id);
    if (exists) {
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
<<<<<<< HEAD
            : cartItem
        )
=======
            : cartItem,
        ),
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
      );
    } else {
      setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
    }

    swal({
      icon: "success",
      title: "Added to Cart",
      text: `${item.productName} has been added to your cart.`,
      timer: 1500,
      buttons: false,
    });
  };

  return (
    <div className="container px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Your Wishlist</h2>
      {wishItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600 border-b text-center">
                  Product
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600 border-b text-center">
                  Price
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600 border-b text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {wishItems.map((item) => (
                <tr key={item.productWishLists.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center">
                    <img
<<<<<<< HEAD
                      src={`http://localhost:8080${item.productWishLists.image}`}
                      alt={item.productWishLists.productName}
=======
                      src={`http://localhost:8080${item.image}`}
                      alt={item.productName}
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <span>{item.productWishLists.productName}</span>
                  </td>
                  {/* <td className="py-3 px-4 text-gray-800">
                    {item.productPrice.toLocaleString("vi-VN")} ₫
                  </td> */}
                  <td className="py-3 px-4 text-gray-800">
<<<<<<< HEAD
                    {typeof item.productWishLists.productPrice === "number"
                      ? item.productWishLists.productPrice.toLocaleString(
                          "vi-VN"
                        )
                      : "0"}{" "}
                    ₫
=======
                    {item.productPrice.toLocaleString("vi-VN")} ₫
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => addToCartFromWishlist(item)}
                      className="bg-green hover:bg-green-600 text-black px-3 py-1 rounded"
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <img
                        className="block size-5"
                        src="images/ico_trash.png"
                        alt="Delete"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WishList;
