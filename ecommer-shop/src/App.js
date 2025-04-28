import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./User/components/Header";
import Footer from "./User/components/Footer";
import Banner from "./User/components/Banner";
import Service from "./User/components/Service";
import Category from "./User/components/Category";
import ProductDetail from "./User/components/pages/ProductDetail";
import ShoppingCart from "./User/components/pages/ShoppingCart";
import ProductList from "./User/components/pages/ProductList";
import Blog from "./User/components/Blog";
import GoTop from "./User/components/goTop";
import Login from "./User/components/Login";
import Register from "./User/components/Register";
import Profile from "./User/components/pages/Profile";
import ScrollToTop from "./User/components/ScrollToTop";
import AboutUS from "./User/components/AboutUs";
import WishList from "./User/components/pages/WishList";
import { WishlistProvider } from "./User/context/WishlistContext"; // Import WishlistProvider
import CheckoutPage from "./User/components/pages/CheckoutPage";
import OrdersPage from "./User/components/pages/OrdersPage";
import AdminProductPage from "./Admin/components/AdminProductPage";

function App() {
  return (
    <WishlistProvider>
      {" "}
      {/* Bọc toàn bộ ứng dụng trong WishlistProvider */}
      <Router>
        <ScrollToTop />
        <div className="App relative">
          <Routes>
            {/* Trang đăng nhập là mặc định */}
            <Route path="/" element={<Login />} />
            {/* Trang đăng ký */}
            <Route path="/register" element={<Register />} />

            {/* Common layout with Header and Footer */}
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

            <Route
              path="/admin"
              element={
                <>
                  <AdminProductPage />
                </>
              }
            />
            {/* Trang profile */}
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
            {/* Chi tiết sản phẩm */}
            <Route
              path="/ProductDetail/:id"
              element={
                <>
                  <Header />
                  <ProductDetail />
                  <Footer />
                </>
              }
            />
            {/* Giỏ hàng */}
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
            {/* Danh sách sản phẩm */}
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
            {/* Blog */}
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
            {/* About us */}
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
            {/* Wishlist */}
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

            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/orders" element={<OrdersPage />} />
          </Routes>

          <GoTop />
        </div>
      </Router>
    </WishlistProvider>
  );
}

export default App;
