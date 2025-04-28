import React from "react";
import { useWishlist } from "../../context/WishlistContext";

const WishList = () => {
  const { wishItems, setWishItems } = useWishlist();

  const removeFromWishlist = (productId) => {
    setWishItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId),
    );
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
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <span>{item.productName}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {item.productPrice} $
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
