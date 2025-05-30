import React, { useEffect, useState } from "react";

const AdminBillPage = () => {
  const [bills, setBills] = useState([]);
  const [, setOrderDetails] = useState(null);
  const [, setIsModalOpen] = useState(false);

  // Fetch all bills (use userId if needed)
  const fetchBills = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/get-all-bill");
      const data = await res.json();
      console.log(data);

      if (data.errCode === 0) {
        setBills(data.data); // ✅ lấy danh sách bill đúng chỗ
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
    <div className="bg-white shadow-lg rounded-xl p-8 w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Bill Management
      </h2>

      {bills.length > 0 ? (
        [...bills]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((bill) => (
            <div
              key={bill.id}
              className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow-md"
            >
              <div className="text-sm">
                <p className="mb-2">
                  <strong>Mã đơn:</strong> #{bill.id}{" "}
                  {bill.createdAt
                    ? new Date(bill.createdAt).toLocaleString()
                    : new Date().toLocaleString()}
                </p>

                <p className="mb-2">
                  <strong>Phương thức:</strong>{" "}
                  {bill.paymentMethod === "Cash" ? "Cash" : "ZaloPay"}
                </p>
                <p className="mb-2">
                  <strong>Trạng Thái:</strong>{" "}
                  {bill.billStatus === "Delivered" ? "Delivered" : "Cancelled"}
                </p>
                <ul className="list-none ml-6 my-2">
                  {bill.billItems.map((item, index) => (
                    <li key={index} className="my-2">
                      <span>
                        {item.quantity} x{" "}
                        {item.products?.productName ||
                          "Sản phẩm không xác định"}
                      </span>
                      <span className="text-gray-600">
                        (
                        {item.products?.productPrice
                          ? Number(item.products.productPrice).toLocaleString(
                              "vi-VN",
                            )
                          : "Giá không xác định"}
                        ₫)
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mb-4">
                  <strong>Tổng cộng:</strong>
                  <span className="text-green-700 font-semibold ml-2">
                    {bill.totalPrice && bill.totalPrice > 0
                      ? bill.totalPrice.toLocaleString("vi-VN")
                      : "0.00"}{" "}
                    ₫
                  </span>
                </p>
                <button
                  onClick={() => openOrderDetails(bill)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))
      ) : (
        <p className="text-center text-gray-500 font-semibold text-xl">
          Không có đơn hàng nào.
        </p>
      )}
    </div>
  );
};

export default AdminBillPage;
