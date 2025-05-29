
import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // Khởi tạo từ localStorage nếu có
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  });

  // Lưu mỗi khi orders thay đổi
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
