// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const { addOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = cartItems.reduce(
    (acc, item) => acc + item.productPrice * item.quantity,
    0,
  );

  const handlePlaceOrder = () => {
    const newOrder = {
      id: Date.now(), // hoặc dùng uuid nếu cần
      items: cartItems,
      total,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder); // 👉 lưu vào OrderContext

    if (paymentMethod === "cod") {
      alert("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
    } else {
      alert("Vui lòng quét mã để chuyển khoản và xác nhận đã thanh toán.");
    }

    // (Tùy chọn) Xóa giỏ hàng sau khi đặt hàng
    setCartItems([]);
    navigate("/home");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      {/* Danh sách sản phẩm */}
      <div className="mb-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-500 text-left">
                {item.quantity} x $
                {typeof item.productPrice === "number"
                  ? item.productPrice.toFixed(2)
                  : Number(item.productPrice).toFixed(2)}
              </p>
            </div>
            <div className="text-right font-medium">
              ${(item.productPrice * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-semibold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Chọn phương thức thanh toán:</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Thanh toán khi nhận hàng
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="qr"
              checked={paymentMethod === "qr"}
              onChange={() => setPaymentMethod("qr")}
            />
            Quét mã để chuyển khoản
          </label>
        </div>
      </div>

      {/* Nếu chọn quét mã thì hiển thị mã QR */}
      {paymentMethod === "qr" && (
        <div className="mb-6 text-center">
          <p className="mb-2">Vui lòng quét mã bên dưới để thanh toán:</p>
          <img
            src="/images/qr_code.jpg"
            alt="QR Code"
            className="mx-auto max-w-[200px] border border-gray-300 rounded-lg"
          />
          <p className="mt-2 text-sm text-gray-600">
            Nội dung chuyển khoản: [Tên khách hàng] - [Số điện thoại]
          </p>
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        className="bg-black text-white w-full py-3 rounded-full hover:bg-white hover:text-black border hover:border-black transition-all font-semibold"
      >
        Xác nhận đặt hàng
      </button>
    </div>
  );
};

export default CheckoutPage;
