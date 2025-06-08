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

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await axios.post("http://localhost:8080/api/login", {
  //       email,
  //       password,
  //     });

  //     const { errCode, user } = response.data;

  //     if (errCode === 0) {
  //       localStorage.setItem("user", JSON.stringify(user));
  //       navigate(user.roleId === "admin" ? "/admin" : "/shop");
  //       setUser(user);
  //     } else {
  //       setError("Invalid or unauthorized account");
  //     }
  //     localStorage.setItem("user", JSON.stringify(user));
  //     loginUser(user);
  //   } catch (err) {
  //     setError("Incorrect email or password");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
        // Lưu theo role
        if (user.roleId === "admin") {
          localStorage.setItem("admin", JSON.stringify(user));
          navigate("/admin");
        } else {
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/home");
        }

        setUser(user);
        loginUser(user);
      } else {
        setError("Invalid or unauthorized account");
      }
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
