import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const { addOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = cartItems.reduce(
    (acc, item) => acc + item.productPrice * item.quantity,
    0
  );
  console.log(total);

  const handlePlaceOrder = () => {
    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    // swal("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.", "success");
    swal({
      title: "Thank for buying!",
      text: "Order successful! You will pay upon receipt of goods.!",
      icon: "success",
      button: "OK",
    });
    setCartItems([]);
    navigate("/home");
  };

  // const handleCheckOut = () => {
  //   const order = {
  //     items: cartItems,
  //     description: "ZaloPay demo",
  //     amount: total,
  //   };
  //   console.log(order.amount);

  //   fetch("http://localhost:8080/api/zalopay-order", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(order),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Success:", data);
  //       window.location.href = data.order_url; // chuyển hướng qua trang thanh toán QR
  //     })
  //     .catch((error) => {
  //       console.log("Error", error);
  //     });
  // };
  const handleCheckOut = () => {
    const order = {
      items: cartItems,
      description: "ZaloPay demo",
      amount: total,
    };

    fetch("http://localhost:8080/api/zalopay-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);

        // Đổi từ redirect_url sang order_url
        if (data.return_code === 1 && data.order_url) {
          window.location.href = data.order_url;
        } else {
          alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
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
                {item.quantity} x {item.productPrice.toLocaleString("vi-VN")}₫
              </p>
            </div>
            <div className="text-right font-medium">
              {(item.productPrice * item.quantity).toLocaleString("vi-VN")}₫
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-semibold text-lg">
          <span>Total:</span>
          <span>{total.toLocaleString("vi-VN")}₫</span>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Select payment method:</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="qr"
              checked={paymentMethod === "qr"}
              onChange={() => setPaymentMethod("qr")}
            />
            Pay with ZaloPay
          </label>
        </div>
      </div>

      {/* QR code hiển thị nếu chọn qr */}
      {/* {paymentMethod === "qr" && (
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
      )} */}
      {paymentMethod === "qr" && (
        <div className="mb-6 text-center">
          <img
            src="/images/zalopay-logo.png" // Đặt đúng đường dẫn đến file logo
            alt="ZaloPay"
            className="mx-auto max-w-[200px] animate-pulse"
          />
          <p className="mt-2 text-sm text-gray-600">
            Redirecting to ZaloPay...
          </p>
        </div>
      )}

      <button
        onClick={handleConfirmOrder}
        className="bg-black text-white w-full py-3 rounded-full hover:bg-white hover:text-black border hover:border-black transition-all font-semibold"
      >
        Order Confirmation
      </button>
    </div>
  );
};

export default CheckoutPage;
