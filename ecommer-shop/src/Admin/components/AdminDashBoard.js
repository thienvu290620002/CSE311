import React, { useContext, useState } from "react";
import { FaBox, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { UserContext } from "../../User/context/UserContext";
import { useNavigate } from "react-router-dom";
import AdminUserPage from "./AdminUserPage";
import AdminProductPage from "./AdminProductPage";
import AdminBillPage from "./AdminBillPage";

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // cần thiết
  const { setUser } = useContext(UserContext); // lấy setUser từ context
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

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
              <FaBox /> Bill Management
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                activeTab === "users" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <FaUsers /> User Management
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                activeTab === "products" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <FaBox /> Product Management
            </div>
          </li>

          <li>
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600"
            >
              <FaSignOutAlt /> Sign Out
            </div>
          </li>
        </ul>
      </aside>

      {/* Content area */}
      <main className="flex-1 p-6">
        {activeTab === "dashboard" && <AdminBillPage />}
        {activeTab === "users" && (
          <AdminUserPage goBack={() => setActiveTab("dashboard")} />
        )}
        {activeTab === "products" && (
          <AdminProductPage goBack={() => setActiveTab("dashboard")} />
        )}
      </main>
    </div>
  );
};

export default AdminDashBoard;
