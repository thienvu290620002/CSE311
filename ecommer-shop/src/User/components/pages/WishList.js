import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import swal from "sweetalert";
const WishList = () => {
  const { wishItems, setWishItems } = useWishlist();

  // const removeFromWishlist = (productId) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Do you really want to remove this item from your cart?",
  //     icon: "warning",
  //     buttons: ["Cancel", "Yes, remove it"],
  //     dangerMode: true,
  //   })
  //   setWishItems((prevItems) =>
  //     prevItems.filter((item) => item.id !== productId)
  //   );
  // };
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
          prevItems.filter((item) => item.id !== productId)
        );

        swal("Removed!", "The item has been removed from your wishlist.", {
          icon: "success",
        });
      } else {
        swal("Cancelled", "The item is still in your wishlist.");
      }
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
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {wishItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center">
                    <img
                      src={`http://localhost:8080${item.image}`}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <span>{item.productName}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {item.productPrice.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="py-3 px-4 text-red-600">
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
