import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [roleId] = useState("user");
  const [error, setError] = useState("");

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post("http://localhost:8080/api/login", {
  //       email,
  //       password,
  //     });

  //     const { errCode, user } = response.data;

  //     if (errCode === 0 && user.roleId === "admin") {
  //       localStorage.setItem("user", JSON.stringify(user));
  //       setUser(user);
  //       navigate("/admin");
  //     } else if (errCode === 0 && user.roleId === "user") {
  //       localStorage.setItem("user", JSON.stringify(user));
  //       setUser(user);
  //       navigate("/shopping-cart");
  //     } else {
  //       setError("Invalid or unauthorized account");
  //     }
  //   } catch (err) {
  //     setError("Incorrect email or password");
  //   }
  // };
  const [loading, setLoading] = useState(false);

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
        setUser(user);
        navigate(user.roleId === "admin" ? "/admin" : "/shop");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
          👋 Welcome Back!
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Login to your account below
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          <p className="text-sm mt-3 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
