import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./User/styles/tailwind.css";

// Import context cho User và Admin
import { UserProvider } from "./User/context/UserContext"; // Đảm bảo đúng đường dẫn của UserContext
import { CartProvider } from "./User/context/CartContext";
import { WishlistProvider } from "./User/context/WishlistContext";
import { OrderProvider } from "./User/context/OrderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Bọc cả UserProvider và AdminProvider */}
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  </React.StrictMode>,
);

reportWebVitals();
