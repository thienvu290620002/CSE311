import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: "user", // Luôn là "user"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.find((user) => user.email === formData.email);
    if (emailExists) {
      setError("Email đã được đăng ký");
      return;
    }

    const newUser = { ...formData, id: Date.now() };
    users.push(newUser);
    localStorage.setItem("userInfor", JSON.stringify(users));

    alert("Đăng ký thành công!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Tạo Tài Khoản</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Họ"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Tên"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Ẩn role, set mặc định là user */}
          {/* <input type="hidden" name="role" value="user" /> */}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-medium"
          >
            Đăng ký
          </button>

          <p className="text-sm mt-2 text-center">
            Đã có tài khoản?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
