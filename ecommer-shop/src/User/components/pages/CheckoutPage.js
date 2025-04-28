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
    (acc, item) => acc + item.productPrice * item.quantity * 1000,
    0
  );
 // console.log(total);

  const handlePlaceOrder = () => {
    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);

    alert("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
    setCartItems([]);
    navigate("/home");
  };

  const handleCheckOut = () => {
    const order = {
      items: cartItems,
      description: "ZaloPay demo",
      amount: total,
    };
    console.log(order.amount);

    fetch("http://localhost:8080/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        window.location.href = data.order_url; // chuyển hướng qua trang thanh toán QR
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (paymentMethod === "cod") {
      handlePlaceOrder();
    } else if (paymentMethod === "qr") {
      handleCheckOut();
    }
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
                {item.quantity} x ${item.productPrice.toFixed(3)}
              </p>
            </div>
            <div className="text-right font-medium">
              ${(item.productPrice * item.quantity).toFixed(3)}
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-semibold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(3)}</span>
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
            Thanh toán bằng ZaloPay
          </label>
        </div>
      </div>

      {/* QR code hiển thị nếu chọn qr */}
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
        onClick={handleConfirmOrder}
        className="bg-black text-white w-full py-3 rounded-full hover:bg-white hover:text-black border hover:border-black transition-all font-semibold"
      >
        Xác nhận đặt hàng
      </button>
    </div>
  );
};

export default CheckoutPage;
