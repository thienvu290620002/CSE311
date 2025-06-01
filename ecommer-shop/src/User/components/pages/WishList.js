import React, { useEffect } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import swal from "sweetalert";
import axios from "axios";

const WishList = () => {
  const { wishItems, setWishItems, statusChanged } = useWishlist();
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
  }, [setWishItems]);

  const removeFromWishlist = (productId) => {
    const userString = localStorage.getItem("user");
    const userId = userString ? JSON.parse(userString).id : null;

    if (!userId) {
      swal.error("User not found. Please log in.", "error");
      return;
    }

    swal({
      title: "Are you sure?",
      text: "Do you really want to remove this item from your wishlist?",
      icon: "warning",
      buttons: ["Cancel", "Yes, remove it!"],
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
            setWishItems((prevItems) =>
              prevItems.filter(
                (item) =>
                  item.productWishLists &&
                  item.productWishLists.productId !== productId
              )
            );

            swal(
              "Removed!",
              "The item has been removed from your wishlist.",
              "success"
            );
          })
          .catch(() => {
            swal("Error", "Could not remove item from wishlist.", "error");
          });
      } else {
        swal("Cancelled", "The item is still in your wishlist.", "info");
      }
    });
  };
  const addToCartFromWishlist = (item) => {
    // Lấy thông tin sản phẩm từ wishlist
    const product = item.productWishLists || item;

    const availableQuantity = product.quantity ?? 0;

    // Tìm xem sản phẩm đã có trong giỏ chưa
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.productId === product.productId
    );

    const cartQuantity = existingCartItem?.quantity ?? 0;

    if (cartQuantity >= availableQuantity) {
      swal({
        title: "Out of Stock",
        text: `${product.productName} is already in your cart with the maximum available quantity.`,
        icon: "error",
        timer: 1500,
        buttons: false,
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

  useEffect(() => {
    // Ví dụ fetch lại danh sách wishlist từ API hoặc lấy từ context
    // fetchWishlist();
  }, [statusChanged]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Wishlist</h2>

      {wishItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your wishlist is empty.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="py-4 px-6 text-left border-b">Product</th>
                <th className="py-4 px-6 text-center border-b">Price</th>
                <th className="py-4 px-6 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishItems
                .filter(
                  (item) =>
                    item.wishListStatus === "active" && item.productWishLists
                )
                .map((item) => (
                  <tr
                    key={item.productWishLists.productId}
                    className="hover:bg-gray-100 transition"
                  >
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img
                        src={`http://localhost:8080${item.productWishLists.image}`}
                        alt={item.productWishLists.productName}
                        className="w-16 h-16 object-cover rounded-md shadow"
                      />
                      <span className="font-medium text-base">
                        {item.productWishLists.productName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-green-600">
                      {typeof item.productWishLists.productPrice === "number"
                        ? item.productWishLists.productPrice.toLocaleString(
                            "vi-VN"
                          )
                        : "0"}{" "}
                      ₫
                    </td>
                    <td className="py-4 px-6 text-center align-middle">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          type="button"
                          onClick={() => addToCartFromWishlist(item)}
                          className="bg-green text-white text-sm px-4 py-2 rounded-lg shadow transition"
                        >
                          Add to Cart
                        </button>
                        {/* <button
                          type="button"
                          onClick={() =>
                            removeFromWishlist(item.productWishLists.productId)
                          }
                          className="bg-red-100 hover:bg-red-200 p-2 rounded-full shadow"
                        >
                          <img
                            className="w-5 h-5"
                            src="images/ico_trash.png"
                            alt="Delete"
                          />
                        </button> */}
                        <button
                          type="button"
                          onClick={() =>
                            removeFromWishlist(item.productWishLists.productId)
                          }
                          className="bg-red-500 hover:bg-red-300 text-white text-sm px-4 py-2 rounded-lg shadow transition"
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
