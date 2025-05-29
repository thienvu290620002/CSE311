import React, { useEffect } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import swal from "sweetalert";
import axios from "axios";

const WishList = () => {
  const { wishItems, setWishItems, statusChanged } = useWishlist();
  const { addToCart } = useCart();
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
              prevItems.filter((item) => item.productWishLists.id !== productId)
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
    const itemWithQuantityOne = {
      ...item,
      quantity: 1,
      productWishLists: {
        ...item.productWishLists,
        quantity: 1,
      },
    };

    addToCart(itemWithQuantityOne);

    swal({
      title: "Added to Cart",
      text: `${item.productWishLists?.productName || item.productName} has been added to your cart.`,
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
              {wishItems
                .filter((item) => item.wishListStatus === "active")
                .map((item) => (
                  <tr
                    key={item.productWishLists.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 flex items-center">
                      <img
                        src={`http://localhost:8080${item.productWishLists.image}`}
                        alt={item.productWishLists.productName}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <span>{item.productWishLists.productName}</span>
                    </td>
                    {/* <td className="py-3 px-4 text-gray-800">
                    {item.productPrice.toLocaleString("vi-VN")} ₫
                  </td> */}
                    <td className="py-3 px-4 text-gray-800">
                      {typeof item.productWishLists.productPrice === "number"
                        ? item.productWishLists.productPrice.toLocaleString(
                            "vi-VN"
                          )
                        : "0"}{" "}
                      ₫
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
