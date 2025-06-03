import React, { useEffect, useState } from "react";

const AdminBillPage = () => {
  const [bills, setBills] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBills = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/get-all-bill");
      const data = await res.json();
      if (data.errCode === 0) {
        setBills(data.data);
      } else {
        console.error("Error from API:", data.message);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const openOrderDetails = (bill) => {
    setOrderDetails(bill);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Bill Management
      </h2>

      {bills.length > 0 ? (
        [...bills]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((bill) => (
            <div
              key={bill.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-semibold text-gray-900">
                  Order ID: <span className="text-indigo-600">#{bill.id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {bill.createdAt
                    ? new Date(bill.createdAt).toLocaleString()
                    : new Date().toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Payment:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      bill.paymentMethod === "Cash"
                        ? "bg-blue-800 text-white"
                        : "bg-blue-800 text-white"
                    }`}
                  >
                    {bill.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      bill.billStatus === "Delivered"
                        ? "bg-green text-white"
                        : bill.billStatus === "Pending"
                          ? "bg-yellow-400 text-white"
                          : "bg-red-500 text-white"
                    }`}
                  >
                    {bill.billStatus}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-6">
                {bill.billItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <img
                      src={
                        item.products?.image
                          ? `http://localhost:8080${item.products.image}`
                          : "https://via.placeholder.com/60"
                      }
                      alt="Product"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold text-lg">
                        {item.products?.productName || "Unknown Product"}
                      </p>
                      <p className="text-gray-600">
                        Quantity:{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>
                    <p className="text-indigo-700 font-semibold text-lg whitespace-nowrap">
                      {item.products?.productPrice
                        ? Number(item.products.productPrice).toLocaleString(
                            "vi-VN"
                          )
                        : "N/A"}{" "}
                      ₫
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-green-700">
                  Total:{" "}
                  <span>
                    {bill.totalPrice && bill.totalPrice > 0
                      ? bill.totalPrice.toLocaleString("vi-VN")
                      : "0"}{" "}
                    ₫
                  </span>
                </p>
                <button
                  onClick={() => openOrderDetails(bill)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
      ) : (
        <p className="text-center text-gray-400 text-lg font-medium">
          No orders found.
        </p>
      )}

      {/* MODAL */}
      {isModalOpen && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Order Details #{orderDetails.id}
            </h3>
            <p className="mb-2 text-gray-700">
              <strong>User ID:</strong> {orderDetails.userId || "N/A"}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Payment Method:</strong> {orderDetails.paymentMethod}
            </p>
            <p className="mb-6 text-gray-700">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-sm font-semibold ${
                  orderDetails.billStatus === "Delivered"
                    ? "bg-green text-white" /* Màu xanh lá cây đậm hơn cho Delivered */
                    : orderDetails.billStatus === "Pending"
                      ? "bg-yellow-400 text-gray-800" /* Màu vàng cho Pending, chữ đen */
                      : "bg-red-500 text-white" /* Màu đỏ cho các trạng thái khác (ví dụ: Cancelled) */
                }`}
              >
                {orderDetails.billStatus}
              </span>
            </p>

            <h4 className="text-xl font-semibold mb-4 text-gray-800">
              Products:
            </h4>
            <ul className="space-y-4">
              {orderDetails.billItems?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 border border-gray-200 rounded-lg p-3 shadow-sm"
                >
                  <img
                    src={
                      item.products?.image
                        ? `http://localhost:8080${item.products.image}`
                        : "https://via.placeholder.com/60"
                    }
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-lg">
                      {item.products?.productName || "Unknown Product"}
                    </p>
                    <p className="text-gray-600">
                      Quantity:{" "}
                      <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>
                  <p className="text-indigo-700 font-semibold text-lg whitespace-nowrap">
                    {item.products?.productPrice
                      ? Number(item.products.productPrice).toLocaleString(
                          "vi-VN"
                        )
                      : "0"}{" "}
                    ₫
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xl font-bold text-green-700">
              Total: {orderDetails.totalPrice?.toLocaleString("vi-VN")} ₫
            </p>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBillPage;
