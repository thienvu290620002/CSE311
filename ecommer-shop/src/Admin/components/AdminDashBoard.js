// import React, { useContext, useState } from "react";
// import { FaReceipt, FaBox, FaUsers, FaSignOutAlt } from "react-icons/fa";
// import { UserContext } from "../../User/context/UserContext";
// import { useNavigate } from "react-router-dom";
// import AdminUserPage from "./AdminUserPage";
// import AdminProductPage from "./AdminProductPage";
// import AdminBillPage from "./AdminBillPage";

// const AdminDashBoard = () => {
//   const [activeTab, setActiveTab] = useState("dashboard"); // cần thiết
//   const { setUser } = useContext(UserContext); // lấy setUser từ context
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
//       {/* Sidebar */}
//       <aside className="w-80 bg-white shadow-md p-6 space-y-6">
//         <h2 className="text-xl font-bold text-gray-700 mb-4">Admin Panel</h2>
//         <ul className="space-y-3 text-gray-600">
//           <li>
//             <div
//               onClick={() => setActiveTab("dashboard")}
//               className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
//                 activeTab === "dashboard" ? "text-blue-600 font-semibold" : ""
//               }`}
//             >
//               <FaReceipt /> Bill Management
//             </div>
//           </li>
//           <li>
//             <div
//               onClick={() => setActiveTab("users")}
//               className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
//                 activeTab === "users" ? "text-blue-600 font-semibold" : ""
//               }`}
//             >
//               <FaUsers /> User Management
//             </div>
//           </li>
//           <li>
//             <div
//               onClick={() => setActiveTab("products")}
//               className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
//                 activeTab === "products" ? "text-blue-600 font-semibold" : ""
//               }`}
//             >
//               <FaBox /> Product Management
//             </div>
//           </li>

//           <li>
//             <div
//               onClick={handleLogout}
//               className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600"
//             >
//               <FaSignOutAlt /> Sign Out
//             </div>
//           </li>
//         </ul>
//       </aside>

//       {/* Content area */}
//       <main className="flex-1 p-6">
//         {activeTab === "dashboard" && <AdminBillPage />}
//         {activeTab === "users" && (
//           <AdminUserPage goBack={() => setActiveTab("dashboard")} />
//         )}
//         {activeTab === "products" && (
//           <AdminProductPage goBack={() => setActiveTab("dashboard")} />
//         )}
//       </main>
//     </div>
//   );
// };

// export default AdminDashBoard;
import React, { useContext, useState } from "react";
import { FaBox, FaUsers, FaSignOutAlt, FaChartBar } from "react-icons/fa"; // Thêm icon dashboard
import { UserContext } from "../../User/context/UserContext";
import { useNavigate } from "react-router-dom";
import AdminUserPage from "./AdminUserPage";
import AdminProductPage from "./AdminProductPage";
import AdminBillPage from "./AdminBillPage";

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans antialiased">
      {" "}
      {/* Thêm font-sans và antialiased */}
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-xl p-6 flex flex-col justify-between">
        {" "}
        {/* Gradient, shadow mạnh hơn, text trắng, flex-col để căn chỉnh sign out */}
        <div>
          <h2 className="text-3xl font-extrabold text-center mb-10 tracking-wide">
            {" "}
            {/* Font lớn hơn, đậm hơn, căn giữa */}
            Admin Panel
          </h2>
          <ul className="space-y-4">
            {" "}
            {/* Khoảng cách giữa các mục lớn hơn */}
            <li>
              <div
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                  ${
                    activeTab === "dashboard"
                      ? "bg-blue-600 text-white shadow-md transform scale-105" // Màu active, đổ bóng, hiệu ứng nhẹ
                      : "text-blue-200 hover:bg-blue-600 hover:text-white" // Màu hover
                  }`}
              >
                <FaChartBar className="text-lg" /> Bill Management{" "}
                {/* Thay icon và text cho phù hợp với "dashboard" là quản lý bill */}
              </div>
            </li>
            <li>
              <div
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                  ${
                    activeTab === "users"
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "text-blue-200 hover:bg-blue-600 hover:text-white"
                  }`}
              >
                <FaUsers className="text-lg" /> User Management
              </div>
            </li>
            <li>
              <div
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                  ${
                    activeTab === "products"
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "text-blue-200 hover:bg-blue-600 hover:text-white"
                  }`}
              >
                <FaBox className="text-lg" /> Product Management
              </div>
              <div
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
            text-blue-200 hover:bg-red-600 hover:text-white mt-8" // Margin top để đẩy xuống, màu đỏ khi hover
              >
                <FaSignOutAlt className="text-lg" /> Sign Out
              </div>
            </li>
          </ul>
        </div>
        {/* Sign Out - Đặt ở cuối sidebar */}
      </aside>
      {/* Content area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {" "}
        {/* Padding lớn hơn, cho phép scroll nếu nội dung dài */}
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
