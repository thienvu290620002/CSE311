
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
<<<<<<< HEAD
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

=======
  const [user, setUser] = useState(null);

  // Load user từ localStorage khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Khi user thay đổi (đăng nhập hoặc đăng xuất), cập nhật localStorage
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
<<<<<<< HEAD
      localStorage.removeItem("user");
=======
      localStorage.removeItem("user"); // Đảm bảo xoá khi logout hoặc reload
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
