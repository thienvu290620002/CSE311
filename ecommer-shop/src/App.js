import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Header from "./User/components/homepage/Header";
import Footer from "./User/components/homepage/Footer";
import Banner from "./User/components/homepage/Banner";
import Service from "./User/components/services/Service";
import Category from "./User/components/homepage/Category";
import ProductDetail from "./User/components/pages/ProductDetail";
import ShoppingCart from "./User/components/pages/ShoppingCart";
import ProductList from "./User/components/pages/ProductList";
import Blog from "./User/components/homepage/Blog";
import GoTop from "./User/components/services/goTop";
import Login from "./User/components/services/Login";
import Register from "./User/components/services/Register";
import Profile from "./User/components/pages/Profile";
import ScrollToTop from "./User/components/services/ScrollToTop";
import AboutUS from "./User/components/homepage/AboutUs";
import WishList from "./User/components/pages/WishList";
import { WishlistProvider } from "./User/context/WishlistContext";
import CheckoutPage from "./User/components/pages/CheckoutPage";
// import OrdersPage from "./User/components/pages/OrdersPage";
import AdminDashBoard from "./Admin/components/AdminDashBoard";
import PrivateRoute from "./User/components/services/PrivateRoute"; // Thêm dòng này
import ResultPage from "./User/components/pages/ResultPage";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./User/context/UserContext";

function App() {
  return (
    <div>
      <UserProvider>
        {" "}
        {/* ✅ Thêm dòng này để bọc toàn bộ app */}
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <div className="App relative">
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/home"
                  element={
                    <>
                      <Header />
                      <Banner />
                      <Service />
                      <Category />
                      <Footer />
                    </>
                  }
                />
                <Route path="/admin" element={<AdminDashBoard />} />
                <Route
                  path="/profile"
                  element={
                    <>
                      <Header />
                      <Profile />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/productdetail/:productId"
                  element={
                    <>
                      <Header />
                      <ProductDetail />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/shopping-cart"
                  element={
                    <>
                      <Header />
                      <ShoppingCart />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <>
                      <Header />
                      <ProductList />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <>
                      <Header />
                      <Blog />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/about-us"
                  element={
                    <>
                      <Header />
                      <AboutUS />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/wish-list"
                  element={
                    <>
                      <Header />
                      <WishList />
                      <Footer />
                    </>
                  }
                />
                {/* ✅ Các trang yêu cầu đăng nhập */}
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <CheckoutPage />
                    </PrivateRoute>
                  }
                />
                {/* <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <OrdersPage />
                    </PrivateRoute>
                  }
                /> */}
                <Route path="/result" element={<ResultPage />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <GoTop />
            </div>
          </Router>
        </WishlistProvider>
      </UserProvider>{" "}
      {/* ✅ Đóng lại ở đây */}
    </div>
  );
}

export default App;
