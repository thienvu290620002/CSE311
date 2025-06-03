// // import React, { useContext, useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { UserContext } from "../../context/UserContext";
// // import axios from "axios";
// // import { useWishlist } from "../../context/WishlistContext";

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const { setUser } = useContext(UserContext);
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   //const [roleId] = useState("user");
// //   const [error, setError] = useState("");
// //   // const { fetchWishlist } = useWishlist();
// //   const [loading, setLoading] = useState(false);
// //   const { loginUser } = useWishlist();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     try {
// //       const response = await axios.post("http://localhost:8080/api/login", {
// //         email,
// //         password,
// //       });

// //       const { errCode, user } = response.data;

// //       if (errCode === 0) {
// //         localStorage.setItem("user", JSON.stringify(user));
// //         navigate(user.roleId === "admin" ? "/admin" : "/shop");
// //         // await fetchWishlist(user.id);
// //         setUser(user);
// //       } else {
// //         setError("Invalid or unauthorized account");
// //       }
// //       localStorage.setItem("user", JSON.stringify(user));
// //       loginUser(user); // gọi update userId và fetch wishlist
// //     } catch (err) {
// //       setError("Incorrect email or password");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   // const handleLoginSuccess = (user) => {
// //   //   localStorage.setItem("user", JSON.stringify(user));
// //   //   loginUser(user); // gọi update userId và fetch wishlist
// //   // };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
// //       <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
// //         <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
// //           👋 Welcome Back!
// //         </h2>
// //         <p className="text-sm text-center text-gray-500 mb-6">
// //           Login to your account below
// //         </p>

// //         <form onSubmit={handleLogin} className="space-y-4">
// //           <div>
// //             <label className="text-sm font-medium text-gray-700">Email</label>
// //             <input
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
// //               placeholder="you@example.com"
// //               required
// //             />
// //           </div>

// //           <div>
// //             <label className="text-sm font-medium text-gray-700">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
// //               placeholder="••••••••"
// //               required
// //             />
// //           </div>

// //           {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all"
// //           >
// //             {loading ? "Logging in..." : "Sign In"}
// //           </button>

// //           <p className="text-sm mt-3 text-center">
// //             Don't have an account?{" "}
// //             <Link to="/register" className="text-blue-600 hover:underline">
// //               Sign up
// //             </Link>
// //           </p>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;
// import React, { useContext, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { UserContext } from "../../context/UserContext";
// import axios from "axios";
// import { useWishlist } from "../../context/WishlistContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser } = useContext(UserContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { loginUser } = useWishlist();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:8080/api/login", {
//         email,
//         password,
//       });

//       const { errCode, user } = response.data;

//       if (errCode === 0) {
//         localStorage.setItem("user", JSON.stringify(user));
//         navigate(user.roleId === "admin" ? "/admin" : "/shop");
//         setUser(user);
//       } else {
//         setError("Invalid or unauthorized account");
//       }
//       localStorage.setItem("user", JSON.stringify(user));
//       loginUser(user);
//     } catch (err) {
//       setError("Incorrect email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
//       {" "}
//       {/* Adjusted gradient for a softer look, added padding */}
//       <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out">
//         {" "}
//         {/* Softer shadow, rounded corners, subtle border and hover effect */}
//         <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
//           {" "}
//           {/* Stronger font weight, darker text */}
//           👋 Welcome Back!
//         </h2>
//         <p className="text-md text-center text-gray-600 mb-8">
//           {" "}
//           {/* Slightly larger text, darker gray, more bottom margin */}
//           Login to your account below
//         </p>
//         <form onSubmit={handleLogin} className="space-y-6">
//           {" "}
//           {/* Increased vertical spacing */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Email
//             </label>{" "}
//             {/* Block label, slightly bolder, small bottom margin */}
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200" // Larger text, blue focus ring, no border on focus
//               placeholder="you@example.com"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200" // Larger text, blue focus ring, no border on focus
//               placeholder="••••••••"
//               required
//             />
//           </div>
//           {error && (
//             <p className="text-sm text-red-600 font-medium text-center">
//               {error}
//             </p>
//           )}{" "}
//           {/* Centered error message */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" // Changed to blue, bolder text, subtle hover effect, disabled styles
//           >
//             {loading ? "Logging in..." : "Sign In"}
//           </button>
//           <p className="text-sm mt-4 text-center text-gray-600">
//             {" "}
//             {/* Increased top margin, darker gray */}
//             Don't have an account?{" "}
//             <Link
//               to="/register"
//               className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
//             >
//               {" "}
//               {/* Brighter blue, bolder on hover */}
//               Sign up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { useWishlist } from "../../context/WishlistContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useWishlist();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      const { errCode, user } = response.data;

      if (errCode === 0) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate(user.roleId === "admin" ? "/admin" : "/shop");
        setUser(user);
      } else {
        setError("Invalid or unauthorized account");
      }
      localStorage.setItem("user", JSON.stringify(user));
      loginUser(user);
    } catch (err) {
      setError("Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 p-4">
      {" "}
      {/* Enhanced gradient for a more vibrant background */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          👋 Welcome Back!
        </h2>
        <p className="text-md text-center text-gray-600 mb-8">
          Login to your account below
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          <p className="text-sm mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
