import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useWishlist } from "../../context/WishlistContext";
import { FaUser, FaBox, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Profile = () => {
  const { setCartItems } = useCart();
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
    image: user?.image || "",
  });

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUserData({ ...newUserData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCancelOrder = async (billId) => {
    try {
      // Gửi dữ liệu update billStatus về API
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
        // Cập nhật lại trạng thái order trong userBills
        setUserBills((prevBills) =>
          prevBills.map((bill) =>
            bill.billId === billId ? { ...bill, billStatus: "Cancel" } : bill,
          ),
        );
      } else {
        alert(
          "Failed to cancel order: " + (result.errMessage || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("wishlist");
    setWishItems([]); // xóa wishlist trong state
    setCartItems([]); // reset cartItems trong state -> sẽ kích hoạt useEffect lưu [] vào localStorage
    setUser(null);
    navigate("/");
  };

  const handleUpdateProfile = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, ...newUserData } : u,
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
    setIsEditing(false);
  };

  const removeFromWishlist = (productId) => {
    setWishItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId),
    );
  };

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="mb-4">You are not logged in</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => navigate("/login")}
        >
          Login now
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Account</h2>
        <ul className="space-y-3 text-gray-600">
          <li>
            <div
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                activeTab === "dashboard" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <FaUser /> Information
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                activeTab === "orders" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <FaBox /> Orders
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                activeTab === "wishlist" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <FaHeart /> Wishlist
            </div>
          </li>
          <li>
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600"
            >
              <FaSignOutAlt /> Logout
            </div>
          </li>
        </ul>
      </aside>

      {/* Content */}
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-screen-lg w-full mx-auto">
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              User Information
            </h2>

            <div className="flex justify-center mb-5">
              <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden">
                <img
                  src={
                    newUserData.image
                      ? newUserData.image
                      : user.image
                        ? user.image
                        : "/images/user.jpg"
                  }
                  alt="Avatar"
                  className="w-full h-full min-w-full min-h-full object-cover"
                />
              </div>
            </div>

            {isEditing && (
              <div className="mb-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mx-auto"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start">
                <label className="font-medium w-1/4 text-lg">Full Name:</label>
                {isEditing ? (
                  <div className="flex mt-2 w-3/4">
                    <input
                      type="text"
                      name="firstName"
                      value={newUserData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="flex-1 p-3 border rounded-md text-sm"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={newUserData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="flex-1 p-3 border rounded-md text-sm"
                    />
                  </div>
                ) : (
                  <p className="mt-1 text-lg">
                    {user.firstName} {user.lastName}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <label className="font-medium w-1/4 text-lg">Address:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={newUserData.address}
                    onChange={handleInputChange}
                    className="flex-1 p-3 border rounded-md text-sm"
                  />
                ) : (
                  <p className="mt-1 text-lg">{user.address}</p>
                )}
              </div>

              <div className="flex items-start">
                <label className="font-medium w-1/4 text-lg">
                  Phone Number:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={newUserData.phoneNumber}
                    onChange={handleInputChange}
                    className="flex-1 p-3 border rounded-md text-sm"
                  />
                ) : (
                  <p className="mt-1 text-lg">{user.phoneNumber}</p>
                )}
              </div>

              <div className="flex items-start">
                <label className="font-medium w-1/4 text-lg">Gender:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gender"
                    value={newUserData.gender}
                    onChange={handleInputChange}
                    className="flex-1 p-3 border rounded-md text-sm"
                  />
                ) : (
                  <p className="mt-1 text-lg">{user.gender}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-start flex-wrap">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </>
        )}

        {/* Orders tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Your Orders
            </h2>
            {userBills.length === 0 ? (
              <p className="text-center text-gray-600">
                You have no orders yet.
              </p>
            ) : (
              userBills
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-300 rounded-xl p-6 mb-6 shadow-md max-w-2xl mx-auto bg-white"
                  >
                    {/* Header */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Order ID:
                        </span>{" "}
                        #{order.billId}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Payment:
                        </span>{" "}
                        {order.paymentMethod}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Status:
                        </span>{" "}
                        {order.billStatus}
                      </p>
                    </div>

                    {/* Items */}
                    <ul className="mb-4 divide-y divide-gray-200">
                      {order.billItems?.map((item) => (
                        <li
                          key={item.id}
                          className="py-2 flex items-center gap-4"
                        >
                          <img
                            src={`http://localhost:8080${item.products.image}`}
                            alt={item.products.productName}
                            className="w-14 h-14 object-cover rounded-lg border"
                          />
                          <div className="flex flex-col text-sm">
                            <span className="font-medium text-gray-800">
                              {item.products.productName}
                            </span>
                            <span className="text-gray-600">
                              {item.quantity} x{" "}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.products.productPrice)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {order.billStatus !== "Cancel" ? (
                      <button
                        onClick={() => handleCancelOrder(order.billId)}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <p className="mt-2 text-red-600 font-semibold">
                        Cancelled
                      </p>
                    )}

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-800">
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
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Wishlist
            </h2>
            {wishItems && wishItems.length > 0 ? (
              wishItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b py-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`http://localhost:8080${item.productWishLists.image}`}
                      alt={item.productWishLists.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="text-left">
                      <p className="font-semibold">
                        {item.productWishLists.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.productWishLists.productPrice.toLocaleString(
                          "en-US",
                        )}
                        $
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.productWishLists.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center">
                You haven't added any products to your wishlist.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
