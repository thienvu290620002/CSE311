// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     firstName: "",
//     lastName: "",
//     roleId: "user", // Luôn là "user"
//   });
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = (e) => {
//     e.preventDefault();

//     const users = JSON.parse(localStorage.getItem("users")) || [];

//     const emailExists = users.find((user) => user.email === formData.email);
//     if (emailExists) {
//       setError("Email đã được đăng ký");
//       return;
//     }

//     const newUser = { ...formData, id: Date.now() };
//     users.push(newUser);
//     localStorage.setItem("userInfor", JSON.stringify(users));

//     alert("Đăng ký thành công!");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-center">Tạo Tài Khoản</h2>

//         <form onSubmit={handleRegister} className="space-y-4">
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             placeholder="Họ"
//             required
//             className="w-full px-4 py-2 border rounded-lg"
//           />
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             placeholder="Tên"
//             required
//             className="w-full px-4 py-2 border rounded-lg"
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             required
//             className="w-full px-4 py-2 border rounded-lg"
//           />
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Mật khẩu"
//             required
//             className="w-full px-4 py-2 border rounded-lg"
//           />

//           {/* Ẩn role, set mặc định là user */}
//           {/* <input type="hidden" name="role" value="user" /> */}

//           {error && <p className="text-red-600 text-sm">{error}</p>}

//           <button
//             type="submit"
//             className="w-full bg-black text-white py-2 rounded-lg font-medium"
//           >
//             Đăng ký
//           </button>

//           <p className="text-sm mt-2 text-center">
//             Đã có tài khoản?{" "}
//             <Link to="/login" className="text-blue-600 hover:underline">
//               Đăng nhập
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: "user", // Always "user"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state for the button

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when registration starts

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.find((user) => user.email === formData.email);
    if (emailExists) {
      setError("Email is already registered.");
      setLoading(false); // Reset loading on error
      return;
    }

    const newUser = { ...formData, id: Date.now() };
    users.push(newUser);
    // It's important to use the correct key here.
    // If you used "userInfor" previously for storing all users, stick to it.
    // Otherwise, "users" is more common. I'll use "users" for clarity.
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
    setLoading(false); // Reset loading on success
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-200 p-4">
      {" "}
      {/* Softer, inviting gradient background */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out">
        {" "}
        {/* Refined card styling with hover effect */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          🚀 Create Your Account
        </h2>
        <p className="text-md text-center text-gray-600 mb-8">
          Join us and start your journey!
        </p>
        <form onSubmit={handleRegister} className="space-y-6">
          {" "}
          {/* Increased vertical spacing */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Your first name"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Your last name"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 font-medium text-center">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}{" "}
            {/* Change text based on loading state */}
          </button>
          <p className="text-sm mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
