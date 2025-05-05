import React from "react";
import { useOrders } from "../../context/OrderContext";

const OrdersPage = () => {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return <p className="text-center mt-10">Bạn chưa có đơn hàng nào.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Đơn hàng của bạn</h2>
      {[...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((order) => (
          <div key={order.id} className="border rounded-lg p-4 mb-4 shadow">
            <p className="text-sm text-gray-500">
              Mã đơn: #{order.id} - {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">
              Phương thức:{" "}
              {order.paymentMethod === "cod"
                ? "Thanh toán khi nhận hàng"
                : "Chuyển khoản"}
            </p>
            <ul className="mb-2">
              {order.items.map((item) => (
                <li key={item.id} className="text-sm">
                  {item.quantity} x {item.productName} (
                  {item.productPrice.toLocaleString("vi-VN")}) ₫
                </li>
              ))}
            </ul>
            <p className="font-semibold">
              Tổng cộng: {order.total.toLocaleString("vi-VN")} ₫
            </p>
          </div>
        ))}
    </div>
  );
};

export default OrdersPage;
