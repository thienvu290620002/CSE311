import React, { useContext, useEffect, useState } from "react";
import { FaBox, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useOrders } from "../../User/context/OrderContext";
import { UserContext } from "../../User/context/UserContext";
import { useNavigate } from "react-router-dom";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/getAllProduct")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  console.log(products);

  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    quantity: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const handleInput = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { orders } = useOrders();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mở/đóng modal chi tiết đơn hàng
  const openOrderDetails = (order) => {
    setOrderDetails(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderDetails(null);
  };

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...formData, id: editingId } : p,
        ),
      );
      setEditingId(null);
    } else {
      setProducts((prev) => [
        ...prev,
        { ...formData, id: Date.now(), createdAt: new Date().toISOString() },
      ]);
    }
    setFormData({
      productName: "",
      productPrice: "",
      quantity: "",
      image: "",
    });
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
  };

  const handleDelete = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleAddUser = (newUser) => {
    const newUserWithId = {
      id: Date.now(), // Tự động set ID duy nhất
      ...newUser,
    };
  
    const updatedUsers = [...users, newUserWithId];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };
  

  const [addingUser, setAddingUser] = useState(false);
const [newUser, setNewUser] = useState({
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  password: "",
  role: "user",
  address: "",
  phoneNumber: "",
});


  const handleEditUser = (editedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === editedUser.id ? editedUser : user,
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Cập nhật nếu đang chỉnh người dùng hiện tại
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.id === editedUser.id) {
      localStorage.setItem("user", JSON.stringify(editedUser));
    }
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [editingUser, setEditingUser] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-md p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Admin Panel</h2>
        <ul className="space-y-3 text-gray-600">
          <li>
            <div
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                activeTab === "dashboard" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <FaBox /> Dashboard
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                activeTab === "products" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <FaBox /> Quản lý sản phẩm
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                activeTab === "users" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <FaUsers /> Quản lý người dùng
            </div>
          </li>
          <li>
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600"
            >
              <FaSignOutAlt /> Đăng xuất
            </div>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-xl p-8 w-[852] w-full mx-auto">
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Dashboard
            </h2>

            {/* Sắp xếp đơn hàng theo thời gian tạo, đơn hàng mới nhất lên trên */}
            {orders.length > 0 ? (
              [...orders] // Tạo một bản sao của mảng orders để không thay đổi mảng gốc
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp theo thời gian
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow-md"
                  >
                    <div className="text-sm">
                      <p>
                        <strong>Mã đơn:</strong> #{order.id} -{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Phương thức:</strong>{" "}
                        {order.paymentMethod === "cod"
                          ? "Thanh toán khi nhận hàng"
                          : "Chuyển khoản"}
                      </p>
                      <ul className="list-none ml-6 my-2">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            <span>
                              {item.quantity} x {item.productName}
                            </span>
                            <span className="text-gray-600">
                              ($
                              {typeof item.productPrice === "number"
                                ? item.productPrice.toFixed(2)
                                : Number(item.productPrice).toFixed(2)}
                              )
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p>
                        <strong>Tổng cộng:</strong>{" "}
                        <span className="text-green-700 font-semibold">
                          ${order.total.toFixed(2)}
                        </span>
                      </p>
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="mt-4 text-blue-600 hover:underline"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-gray-500">
                Không có đơn hàng nào.
              </p>
            )}
          </div>
        )}

        {/* Modal Chi Tiết Đơn Hàng */}
        {isModalOpen && orderDetails && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray p-6 rounded-lg max-w-2xl w-full">
              <h2 className="text-2xl font-semibold mb-4">
                Chi tiết đơn hàng #{orderDetails.id}
              </h2>
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {orderDetails.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : "Chuyển khoản"}
              </p>
              <ul className="list-none ml-6 my-2">
                {orderDetails.items.map((item, index) => (
                  <li key={index}>
                    <span>
                      {item.quantity} x {item.productName}
                    </span>
                    <span className="text-gray-600">
                      ($
                      {typeof item.productPrice === "number"
                        ? item.productPrice.toFixed(2)
                        : Number(item.productPrice).toFixed(2)}
                      )
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                <strong>Tổng cộng:</strong>{" "}
                <span className="text-green-700 font-semibold">
                  ${orderDetails.total.toFixed(2)}
                </span>
              </p>
              <button
                onClick={closeModal}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            {/* <h2 className="text-2xl font-semibold mb-4 text-center">
          Quản lý sản phẩm
        </h2> */}
            {/* Thêm component quản lý sản phẩm ở đây */}
            <div className="p-6 max-w-6xl mx-auto">
              <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
                Quản lý sản phẩm
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6 mb-12">
                <div className="grid grid-cols-2 gap-6">
                  <input
                    name="productName"
                    value={formData.productName}
                    onChange={handleInput}
                    placeholder="Tên sản phẩm"
                  />
                  <input
                    name="productPrice"
                    value={formData.productPrice}
                    onChange={handleInput}
                    placeholder="Giá"
                  />
                  <input
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInput}
                    placeholder="Số lượng"
                  />
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleInput}
                    placeholder="Link ảnh"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200"
                  >
                    {editingId !== null ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600">
                      <th className="px-6 py-3 text-left border border-gray-300">
                        Ảnh
                      </th>
                      <th className="px-6 py-3 text-left border border-gray-300">
                        Tên sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left border border-gray-300">
                        Giá
                      </th>
                      <th className="px-6 py-3 text-left border border-gray-300">
                        Số lượng
                      </th>
                      <th className="px-6 py-3 text-left border border-gray-300">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-center border border-gray-300">
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          {product.productName}
                        </td>
                        <td className="px-6 py-4 border border-gray-300">{`$${product.productPrice}`}</td>
                        <td className="px-6 py-4 border border-gray-300">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 flex justify-center border border-gray-300">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:underline mr-4"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:underline"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="p-6 max-w-screen-2xl mx-auto">
            <h1 className="text-3xl font-semibold text-center mb-6">
              Quản lý người dùng
            </h1>

            <div className="flex justify-end mb-4">
  <button
    onClick={() => setAddingUser(true)}
    className="px-4 py-2 bg-green text-black rounded hover:bg-green-700"
  >
    + Thêm người dùng
  </button>
</div>



            {/* Bảng danh sách người dùng */}
            <table className="min-w-full table-auto border border-gray-200 mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-center font-semibold">ID</th>
                  <th className="px-4 py-2 w-1/4 text-center font-semibold">
                    Họ tên
                  </th>
                  <th className="px-4 py-2 w-40 text-center font-semibold">
                    Giới tính
                  </th>
                  <th className="px-4 py-2 text-center font-semibold">Email</th>
                  <th className="px-4 py-2 text-center font-semibold">
                    Địa chỉ
                  </th>
                  <th className="px-4 py-2 text-center font-semibold">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-center font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-200">
                    <td className="px-4 py-2 whitespace-nowrap">{user.id}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.firstName ? user.firstName: ""} {user.lastName ? user.lastName : "Chưa có"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.gender ? user.gender: "Chưa có"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.address ? user.address:"Chưa có"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.phoneNumber ? user.phoneNumber : "Chưa có"}
                    </td>
                    <td className="px-6 py-4 flex justify-center space-x-4">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Form chỉnh sửa người dùng */}
            {editingUser && (
              <div className="bg-white p-6 mt-4 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Chỉnh sửa người dùng
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditUser(editingUser);
                    setEditingUser(null);
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    value={editingUser.firstName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="Họ"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editingUser.lastName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Tên"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editingUser.gender || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        address: e.target.value,
                      })
                    }
                    placeholder="Giới tính"
                    className="border p-2 rounded col-span-2"
                  />
                  <input
                    type="text"
                    value={editingUser.address || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        address: e.target.value,
                      })
                    }
                    placeholder="Địa chỉ"
                    className="border p-2 rounded col-span-2"
                  />
                  <input
                    type="text"
                    value={editingUser.phoneNumber || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="Số điện thoại"
                    className="border p-2 rounded col-span-2"
                  />
                  <div className="col-span-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              </div>
            )}

{addingUser && (
  <div className="bg-white p-6 mt-4 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4">Thêm người dùng mới</h2>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAddUser(newUser);
        setNewUser({
          firstName: "",
          lastName: "",
          gender: "",
          email: "",
          password: "",
          address: "",
          phoneNumber: "",
        });
        setAddingUser(false);
      }}
      className="grid grid-cols-2 gap-4"
    >
      <input
        type="email"
        value={newUser.email}
        onChange={(e) =>
          setNewUser({ ...newUser, email: e.target.value })
        }
        placeholder="Email"
        className="border p-2 rounded col-span-2"
        required
      />
      <input
        type="text"
        value={newUser.password}
        onChange={(e) =>
          setNewUser({ ...newUser, password: e.target.value })
        }
        placeholder="Password"
        className="border p-2 rounded col-span-2"
        required
      />
      
      <div className="col-span-2 flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setAddingUser(false)}
          className="px-4 py-2 bg-gray-300 rounded text-red-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green text-black rounded"
        >
          Lưu
        </button>
      </div>
    </form>
  </div>
)}

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductPage;
