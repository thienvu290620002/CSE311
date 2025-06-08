import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { FaUser, FaBox, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";

const Profile = () => {
  const { cartItems, setCartItems } = useCart();
  const { user, setUser } = useContext(UserContext);
  const { wishItems, setWishItems } = useWishlist();
  const navigate = useNavigate();
  const [userBills, setUserBills] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newUserData, setNewUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: user?.address || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "",
    image: user?.image || "", // This will hold the base64 or URL
  });

  const { addToCart } = useCart();

  const uploadImageToServer = async (file) => {
    try {
      const imageFormData = new FormData();
      imageFormData.append("image", file);
      imageFormData.append("userId", user.id); // Add userId to FormData

      const response = await axios.post(
        "http://localhost:8080/api/upload-user-image",
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (response.status >= 400) {
        throw new Error(response.data.error || "Upload failed");
      }

      return response.data.url;
    } catch (error) {
      console.error("Upload error:", error);
      swal("Error", error.message, "error");
      return null;
    }
  };

  const addToCartFromWishlist = (item) => {
    // Get product information from wishlist
    const product = item.productWishLists || item;

    const availableQuantity = product.quantity ?? 0;

    // Check if the product is already in the cart
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

    // If in stock, add to cart with quantity 1
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
    const fetchUserData = async () => {
      try {
        if (!user?.id) return;

        const [userRes, billRes] = await Promise.all([
          fetch(`http://localhost:8080/api/get-user-by-id?id=${user.id}`),
          fetch(`http://localhost:8080/api/get-bill-by-user-id?id=${user.id}`),
        ]);

        const userData = await userRes.json();
        const billData = await billRes.json();

        if (userData && !userData.error) {
          setUser(userData);
          setNewUserData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            address: userData.address || "",
            phoneNumber: userData.phoneNumber || "",
            gender: userData.gender || "",
            image: userData.image || "",
          });
        }

        if (
          billData &&
          billData.errCode === 0 &&
          Array.isArray(billData.data.bills)
        ) {
          setUserBills(billData.data.bills);
        } else {
          setUserBills([]);
        }
      } catch (error) {
        console.error("Failed to fetch user info or bills:", error);
      }
    };

    fetchUserData();
  }, [user?.id, setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setNewUserData((prev) => ({
        ...prev,
        image: previewURL, // Set the image to the blob URL for preview
        imageFile: file, // Store the file itself to send to the server
      }));
    }
  };

  const handleCancelOrder = async (billId) => {
    try {
      // Send update billStatus data to API
      const response = await fetch("http://localhost:8080/api/update-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId,
          billStatus: "Cancel",
        }),
      });

      const result = await response.json();
      if (result.errCode === 0) {
        // Update order status in userBills
        setUserBills((prevBills) =>
          prevBills.map((bill) =>
            bill.billId === billId ? { ...bill, billStatus: "Cancel" } : bill
          )
        );
        swal("Success!", "Your order has been cancelled.", "success");
      } else {
        swal("Error", result.errMessage || "Failed to cancel order", "error");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      swal("Error", "An error occurred while cancelling the order.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("wishlist");
    setWishItems([]); // Clear wishlist in state
    setCartItems([]); // Reset cartItems in state -> will trigger useEffect to save [] to localStorage
    setUser(null);
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    try {
      let imageUrl = newUserData.image;

      // If there's a user.id and a new image file is selected
      if (user?.id && newUserData.imageFile) {
        const uploadedUrl = await uploadImageToServer(newUserData.imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          swal(
            "Error",
            "Failed to upload image. Profile not updated.",
            "error"
          );
          return;
        }
      }

      const response = await fetch("http://localhost:8080/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          firstName: newUserData.firstName,
          lastName: newUserData.lastName,
          gender: newUserData.gender,
          phoneNumber: newUserData.phoneNumber,
          address: newUserData.address,
          image: imageUrl, // Save the new URL to the database
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const data = await response.json();

      const updatedUser = Array.isArray(data)
        ? data.find((u) => u.id === user.id)
        : data;

      setUser(updatedUser);
      setNewUserData({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        gender: updatedUser.gender || "",
        phoneNumber: updatedUser.phoneNumber || "",
        address: updatedUser.address || "",
        image: updatedUser.image || "",
        imageFile: null, // Clear the file after successful upload/update
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);

      swal({
        title: "Success!",
        text: "Your profile information has been updated successfully.",
        icon: "success",
        timer: 1500,
        buttons: false,
      });
    } catch (error) {
      console.error("Update profile error:", error);

      swal({
        title: "Error!",
        text: "An error occurred while updating your profile.",
        icon: "error",
        buttons: true,
      });
    }
  };

  const removeFromWishlist = (productId) => {
    const userString = localStorage.getItem("user");
    const userId = userString ? JSON.parse(userString).id : null;

    if (!userId) {
      swal("User Not Found", "Please log in.", "error");
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

  if (!user) {
    return (
      <div className="text-center mt-10 p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto">
        <p className="mb-4 text-lg font-semibold text-gray-700">
          You are not logged in
        </p>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-base font-medium shadow-md"
          onClick={() => navigate("/login")}
        >
          Login now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-2xl p-5 md:p-6 space-y-6 transform transition-all duration-500 ease-in-out">
        <h2 className="text-3xl font-extrabold text-white mb-6 border-b-2 border-purple-400 pb-3 text-center tracking-wide">
          My Account
        </h2>
        <ul className="space-y-3">
          <li>
            <div
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105
          ${
            activeTab === "dashboard"
              ? "bg-blue-600 text-white shadow-md transform scale-105" // Màu active, đổ bóng, hiệu ứng nhẹ
              : "text-blue-200 hover:bg-blue-600 hover:text-white" // Màu hover
          }`}
            >
              <FaUser className="text-xl" />{" "}
              <span className=" text-lg">Information</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105
          ${
            activeTab === "orders"
              ? "bg-blue-600 text-white shadow-md transform scale-105" // Màu active, đổ bóng, hiệu ứng nhẹ
              : "text-blue-200 hover:bg-blue-600 hover:text-white" // Màu hover
          }`}
            >
              <FaBox className="text-xl" />{" "}
              <span className=" text-lg">Orders</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105
          ${
            activeTab === "wishlist"
              ? "bg-blue-600 text-white shadow-md transform scale-105" // Màu active, đổ bóng, hiệu ứng nhẹ
              : "text-blue-200 hover:bg-blue-600 hover:text-white" // Màu hover
          }`}
            >
              <FaHeart className="text-xl" />{" "}
              <span className=" text-lg">Wishlist</span>
            </div>
          </li>
          <li>
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-100 bg-red-600 hover:bg-red-700 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 mt-6 shadow-md"
            >
              <FaSignOutAlt className="text-xl" />{" "}
              <span className=" text-lg">Logout</span>
            </div>
          </li>
        </ul>
      </aside>
      {/* Content */}
      <div className="flex-1 p-5 md:p-8 bg-gray-100 flex justify-center items-start">
        {activeTab === "dashboard" && (
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-4xl w-full transform transition-all duration-500 ease-in-out">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center border-b-2 border-blue-600 pb-3">
              Your Profile
            </h2>
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-36 h-36 rounded-full border-4 border-blue-600 overflow-hidden shadow-lg mb-4 flex items-center justify-center bg-gray-200">
                <img
                  src={
                    newUserData.image?.startsWith("blob:")
                      ? newUserData.image
                      : `http://localhost:8080${newUserData.image}`
                  }
                  alt={newUserData.firstName}
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              {isEditing && (
                <div className="text-center">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300 shadow-md"
                  >
                    Upload New Image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" // Hide the default file input
                  />
                </div>
              )}
            </div>
            {/* User Information Fields */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                <label className="font-semibold w-full sm:w-1/4 text-lg text-gray-800 mb-2 sm:mb-0">
                  Full Name:
                </label>
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-3/4">
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={newUserData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="flex-1 p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 shadow-sm"
                    />
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={newUserData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="flex-1 p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 shadow-sm"
                    />
                  </div>
                ) : (
                  <p className="text-lg text-gray-900 font-medium w-full sm:w-3/4">
                    {user.firstName} {user.lastName}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                <label className="font-semibold w-full sm:w-1/4 text-lg text-gray-800 mb-2 sm:mb-0">
                  Address:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    required
                    value={newUserData.address}
                    onChange={handleInputChange}
                    placeholder="Your Address"
                    className="flex-1 p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 w-full sm:w-3/4 shadow-sm"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-medium w-full sm:w-3/4">
                    {user.address}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                <label className="font-semibold w-full sm:w-1/4 text-lg text-gray-800 mb-2 sm:mb-0">
                  Phone Number:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    required
                    value={newUserData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Your Phone Number"
                    className="flex-1 p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 w-full sm:w-3/4 shadow-sm"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-medium w-full sm:w-3/4">
                    {user.phoneNumber}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                <label className="font-semibold w-full sm:w-1/4 text-lg text-gray-800 mb-2 sm:mb-0">
                  Gender:
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={newUserData.gender}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 w-full sm:w-3/4 shadow-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-lg text-gray-900 font-medium w-full sm:w-3/4">
                    {user.gender}
                  </p>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="mt-8 flex justify-center sm:justify-start flex-wrap gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-green text-white px-6 py-2 rounded-lg hover:bg-green-700 text-base font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // Reset newUserData to current user data on cancel
                      setNewUserData({
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                        address: user?.address || "",
                        phoneNumber: user?.phoneNumber || "",
                        gender: user?.gender || "",
                        image: user?.image || "",
                        imageFile: null,
                      });
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-500 text-base font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-base font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        )}
        {/* Orders tab */}
        {activeTab === "orders" && (
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-6xl w-full transform transition-all duration-500 ease-in-out">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 border-b-2 border-indigo-600 pb-3">
              Your Orders
            </h2>
            {userBills.length === 0 ? (
              <p className="text-center text-gray-500 text-xl font-medium py-8">
                You have no orders yet.
              </p>
            ) : (
              userBills
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-blue-50 rounded-lg shadow-md border border-blue-200 mb-6 hover:shadow-lg transition-shadow duration-300 p-5 md:p-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 border-b pb-3 border-blue-200">
                      <p className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                        Order ID:{" "}
                        <span className="text-indigo-700">#{order.billId}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700 text-base">
                          Payment:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.paymentMethod === "Cash"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700 text-base">
                          Status:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.billStatus === "Cancel"
                              ? "bg-red-100 text-red-800"
                              : order.billStatus === "Pending"
                                ? "bg-yellow-500 text-white"
                                : "bg-green text-white"
                          }`}
                        >
                          {order.billStatus === "Cancel"
                            ? "Cancelled"
                            : order.billStatus === "Pending"
                              ? "Pending"
                              : "Delivered"}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <ul className="space-y-3 mb-5">
                      {order.billItems?.map((item) => (
                        <li
                          key={item.id}
                          className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <img
                            src={`http://localhost:8080${item.products.image}`}
                            alt={item.products.productName}
                            className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow-sm"
                          />
                          <div className="flex-1 text-center sm:text-left">
                            <p className="text-gray-900 font-bold text-lg mb-1">
                              {item.products.productName}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Quantity:{" "}
                              <span className="font-semibold">
                                {item.quantity}
                              </span>
                            </p>
                          </div>
                          <p className="text-indigo-700 font-bold text-lg whitespace-nowrap">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.products.productPrice)}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {/* Cancel button or cancelled status */}
                    {order.billStatus === "Pending" ? (
                      // new Date() - new Date(order.createdAt) < 60000
                      // 60000 milliseconds = 1 minute
                      <button
                        onClick={() => handleCancelOrder(order.billId)}
                        className="mt-5 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300 font-medium text-base shadow-md"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <p
                        className={`mt-5 font-bold text-lg ${
                          order.billStatus === "Cancel"
                            ? "text-red-600"
                            : "text-green"
                        }`}
                      >
                        {order.billStatus === "Cancel"
                          ? "Cancelled"
                          : "Delivered"}
                      </p>
                    )}

                    {/* Total */}
                    <div className="text-right mt-6 pt-4 border-t border-gray-200">
                      <p className="text-2xl font-extrabold text-green-700">
                        Total:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
        {/* Wishlist tab */}
        {activeTab === "wishlist" && (
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-6xl w-full transform transition-all duration-500 ease-in-out">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center border-b-2 border-indigo-600 pb-3">
              Your Wishlist
            </h2>
            {wishItems && wishItems.length > 0 ? (
              <div className="space-y-5">
                {wishItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-200"
                  >
                    {/* Left: Product Info */}
                    <div className="flex items-center gap-5 flex-1 mb-4 sm:mb-0">
                      <img
                        src={`http://localhost:8080${item.productWishLists.image}`}
                        alt={item.productWishLists.productName}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                      />
                      <div className="text-center sm:text-left">
                        <p className="font-bold text-xl text-gray-900 mb-1">
                          {item.productWishLists.productName}
                        </p>
                        <p className="text-indigo-700 font-semibold text-lg">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.productWishLists.productPrice)}
                        </p>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={() => addToCartFromWishlist(item)}
                        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg text-base font-medium hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() =>
                          removeFromWishlist(item.productWishLists.productId)
                        }
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-base font-medium transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500 text-xl font-medium">
                You haven't added any products to your wishlist yet. Start
                exploring!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
