import React, { useEffect } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import swal from "sweetalert";
import axios from "axios";

const WishList = () => {
  const { wishItems, setWishItems } = useWishlist(); // Bỏ statusChanged nếu không dùng đến
  const { addToCart } = useCart();
  const { cartItems } = useCart();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const userId = userString ? JSON.parse(userString).id : null;

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
    // Dependency array: Chỉ chạy khi setWishItems thay đổi (thường không thay đổi)
    // Nếu bạn muốn fetch lại khi có thay đổi từ bên ngoài (ví dụ: thêm/bớt sản phẩm từ trang khác),
    // bạn cần truyền dependency tương ứng vào đây.
  }, [setWishItems]); // Bỏ statusChanged nếu không dùng đến ở đây.

  const removeFromWishlist = (productId) => {
    const userString = localStorage.getItem("user");
    const userId = userString ? JSON.parse(userString).id : null;

    if (!userId) {
      swal("Error", "User not found. Please log in.", "error");
      return;
    }

    swal({
      title: "⚠️ Are you sure?",
      text: "Do you really want to remove this item from your wishlist? This action cannot be undone.",
      icon: "warning",
      buttons: {
        cancel: {
          text: "❌ Cancel",
          visible: true,
          className: "swal-button--cancel",
          closeModal: true,
        },
        confirm: {
          text: "✅ Yes, remove it!",
          className: "swal-button--danger",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .post("http://localhost:8080/api/create-wishlist", {
            userId,
            productId,
            wishListStatus: "inactive",
          })
          .then(() => {
            // Cập nhật state wishlist ngay lập tức mà không cần fetch lại toàn bộ
            setWishItems((prevItems) =>
              prevItems.filter(
                (item) =>
                  item.productWishLists &&
                  item.productWishLists.productId !== productId
              )
            );

            swal({
              title: "💔 Removed from Wishlist",
              icon: "success",
              buttons: false,
              timer: 2500,
              content: {
                element: "div",
                attributes: {
                  innerHTML: `
        <p style="font-size: 16px; margin: 0;">
          The item has been successfully <strong>removed</strong>.
        </p>
      `,
                },
              },
            });
          })
          .catch(() => {
            swal("Error", "Could not remove item from wishlist.", "error");
          });
      } else {
        swal({
          title: "❗ Cancelled",
          text: "The item is still in your wishlist.",
          icon: "info",
          timer: 1500,
          buttons: false,
        });
      }
    });
  };

  const addToCartFromWishlist = (item) => {
    // Lấy thông tin sản phẩm từ wishlist
    const product = item.productWishLists || item;

    // Kiểm tra tính hợp lệ của product trước khi truy cập các thuộc tính
    if (
      !product ||
      typeof product.quantity === "undefined" ||
      typeof product.productName === "undefined"
    ) {
      swal("Error", "Product information is incomplete.", "error");
      return;
    }

    const availableQuantity = product.quantity; // Đã kiểm tra undefined ở trên

    // Tìm xem sản phẩm đã có trong giỏ chưa
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.productId === product.productId
    );

    const cartQuantity = existingCartItem?.quantity ?? 0;

    if (cartQuantity >= availableQuantity) {
      swal({
        title: "🚫 Out of Stock",
        icon: "error",
        buttons: false,
        timer: 3000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `
        <p style="font-size: 16px; margin: 0;"><strong>${product.productName}</strong> is already in your cart.</p>
        <p style="margin-top: 5px;">You can only purchase <b>${availableQuantity}</b> item(s).</p>
      `,
          },
        },
      });

      return;
    }

    // Nếu còn hàng => thêm vào cart với số lượng 1
    const itemWithQuantityOne = {
      ...product,
      quantity: 1,
    };

    addToCart(itemWithQuantityOne);

    swal({
      title: "Added to Cart",
      text: `${product.productName} has been added to your cart.`,
      icon: "success",
      timer: 1000,
      buttons: false,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-white shadow-lg rounded-xl max-w-7xl font-sans">
      {" "}
      {/* Container chính với padding, shadow, rounded, max-width */}
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10 border-b-2 border-gray-200 pb-4">
        Your Wishlist
      </h2>
      {wishItems.filter(
        (item) => item.wishListStatus === "active" && item.productWishLists
      ).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg
            className="w-20 h-20 mb-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="text-xl mb-4">Your wishlist is empty.</p>
          <p className="text-md text-gray-600">Start adding items you love!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-200">
          {" "}
          {/* Đổ bóng nhẹ hơn, bo tròn và border */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="py-3 px-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-3 px-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {wishItems
                .filter(
                  (item) =>
                    item.wishListStatus === "active" && item.productWishLists
                )
                .map((item) => (
                  <tr
                    key={item.productWishLists.productId}
                    className="hover:bg-blue-50 transition-colors duration-150" /* Hiệu ứng hover mượt mà */
                  >
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img
                        src={`http://localhost:8080${item.productWishLists.image}`}
                        alt={item.productWishLists.productName}
                        className="w-20 h-20 object-cover rounded-lg shadow-md ring-1 ring-gray-100" /* Ảnh lớn hơn, bo tròn, đổ bóng, viền nhẹ */
                      />
                      <span className="font-medium text-lg text-gray-800">
                        {item.productWishLists.productName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center  text-base font-bold text-green-700 whitespace-nowrap">
                      {" "}
                      {/* Giá lớn hơn, đậm hơn, màu xanh lá */}
                      {typeof item.productWishLists.productPrice === "number"
                        ? item.productWishLists.productPrice.toLocaleString(
                            "vi-VN"
                          )
                        : "0"}{" "}
                      ₫
                    </td>
                    <td className="py-4 px-6 text-center align-middle">
                      <div className="flex justify-center items-center gap-4">
                        {" "}
                        {/* Khoảng cách giữa các nút */}
                        <button
                          type="button"
                          onClick={() => addToCartFromWishlist(item)}
                          className="bg-blue-600 text-white  text-base px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105" /* Nút Add to Cart đẹp hơn */
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromWishlist(item.productWishLists.productId)
                          }
                          className="bg-red-500 text-white  text-base px-6 py-3 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105" /* Nút Remove đẹp hơn */
                        >
                          Remove
                        </button>
                      </div>
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
