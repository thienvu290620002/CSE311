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
    0,
  );

  const displayPaymentMethod = paymentMethod === "cod" ? "Cash" : "ZaloPay";
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  //console.log(userId);

  const handlePlaceOrder = async () => {
    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total,
      paymentMethod: displayPaymentMethod,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8080/api/create-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items: cartItems,
          total,
          paymentMethod: displayPaymentMethod,
        }),
      });

      const data = await response.json();
      console.log("Bill created:", data);
      for (const product of cartItems) {
        await fetch("http://localhost:8080/api/update-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: product.id,
            quantityToReduce: product.quantity,
          }),
        });
      }
      addOrder(newOrder);
      swal({
        title: "Thank you!",
        text: "Order successful! You will pay upon receipt of goods.",
        icon: "success",
        button: "OK",
      });
      localStorage.removeItem("cartItems");
      setCartItems([]);
      navigate("/home");
    } catch (error) {
      console.error("Error creating bill:", error);
      swal({
        title: "Error!",
        text: "There was a problem creating your bill. Please try again.",
        icon: "error",
        button: "OK",
      });
    }
  };

  const handleCancel = () => {
    swal({
      title: "Are you sure?",
      text: "Your order will not be saved!",
      icon: "warning",
      buttons: ["No", "Yes, cancel"],
      dangerMode: true,
    }).then((willCancel) => {
      if (willCancel) {
        navigate("/shopping-cart");
      }
    });
  };
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

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (paymentMethod === "cod") {
      await handlePlaceOrder();
    } else if (paymentMethod === "qr") {
      try {
        // Tạo bill trước
        await handlePlaceOrder();

        // Sau đó tạo order ZaloPay và chuyển hướng
        handleCheckOut();
      } catch (error) {
        swal({
          title: "Error!",
          text: "Failed to create bill before payment. Please try again.",
          icon: "error",
          button: "OK",
        });
      }
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
      <button
        onClick={handleCancel}
        className="mt-4 w-full py-3 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all font-semibold"
      >
        Cancel
      </button>
    </div>
  );
};

export default CheckoutPage;
