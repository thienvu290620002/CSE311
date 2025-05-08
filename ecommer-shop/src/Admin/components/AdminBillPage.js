import React, { useContext, useEffect, useState } from "react";
import { FaBox, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useOrders } from "../../User/context/OrderContext";
import { UserContext } from "../../User/context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminBillPage = () => {
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

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-[852] w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Bill Management
      </h2>

      {orders.length > 0 ? (
        [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
        <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
      )}
    </div>
  );
};
export default AdminBillPage;
