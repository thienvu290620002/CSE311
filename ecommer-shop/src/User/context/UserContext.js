// import { createContext, useState, useEffect } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Load từ localStorage khi app khởi chạy
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser)); // Lấy thông tin user từ localStorage khi khởi chạy
//     }
//   }, []);

//   // Cập nhật localStorage khi user thay đổi
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user)); // Lưu lại user vào localStorage
//     }
//   }, [user]);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Khi user thay đổi (đăng nhập hoặc đăng xuất), cập nhật localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user"); // Đảm bảo xoá khi logout hoặc reload
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
