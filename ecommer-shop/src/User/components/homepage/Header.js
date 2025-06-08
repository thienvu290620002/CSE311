import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import swal from "sweetalert";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const { cartItems, setCartItems } = useCart();

  // Lấy wishlist từ context, ko lấy từ localStorage nữa
  const { wishItems } = useWishlist();
  const searchRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      setQuery("");
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFiltered([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Số lượng wishlist active tính dựa trên wishItems từ context
  const activeWishCount = wishItems.filter(
    (item) => item.wishListStatus === "active"
  ).length;

  // Load sản phẩm như cũ
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-all-product"
        );
        setProducts(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setFiltered([]);
    } else {
      const results = products.filter((item) =>
        item.productName.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results);
    }
  };

  const addToCart = (product) => {
    const stockProduct = products.find(
      (p) => p.productId === product.productId
    );

    const stock = stockProduct?.quantity ?? 0;
    const name = stockProduct?.productName ?? product.productName ?? "Unknown";

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.productId
      );

      if (existingItem) {
        if (existingItem.quantity < stock) {
          swal({
            title: "Quantity Increased",
            text: `Increased quantity for ${name}`,
            icon: "success",
            timer: 1000,
            buttons: false,
          });
          return prevItems.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          swal(
            "Out of Stock",
            `Maximum quantity for ${name} is ${stock}.`,
            "warning"
          );
          return prevItems;
        }
      } else {
        if (stock > 0) {
          swal({
            title: "Added to Cart",
            text: `Added ${name} to cart`,
            icon: "success",
            timer: 800,
            buttons: false,
          });
          return [...prevItems, { ...product, quantity: 1 }];
        } else {
          swal("Out of Stock", `${name} is currently out of stock!`, "warning");
          return prevItems;
        }
      }
    });
  };

  return (
    <header className="py-5 lg:py-8 sticky top-0 z-[60] bg-white shadow-lg">
      <div className="container flex items-center max-w-full px-4">
        <h1 className="flex-shrink-0 mr-5">
          <Link className="block max-w-[130px]" to="/home">
            <img className="max-w-full" src="images/logo.png" alt="Darion" />
          </Link>
        </h1>

        <div
          className="relative ml-auto lg:mr-20 max-w-[500px] w-full hidden xl:block z-50"
          ref={searchRef}
        >
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleChange}
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <img className="size-5" src="images/ico_search.png" alt="Search" />
          </div>

          {filtered.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 mt-2 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50 p-2 space-y-2">
              {filtered.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-4 p-2 hover:bg-amber-50 transition rounded-lg"
                >
                  <Link
                    to={`/productdetail/${item.productId}`}
                    className="flex items-center gap-4 flex-1"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={`http://localhost:8080${item.image}`}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">View details</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => addToCart(item)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav className="mr-28 hidden lg:block ml-auto">
          <ul className="flex items-center gap-10">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/about-us">About us</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link href="#none">Featured</Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-6 ml-auto lg:ml-0 shrink-0">
          <Link to="" className="lg:hidden">
            <img className="size-5" src="images/ico_search.png" alt="" />
          </Link>
          <Link to="/profile">
            <img className="size-5" src="images/ico_user.png" alt="" />
          </Link>

          <Link to="/wish-list" className="relative">
            {activeWishCount > 0 && (
              <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
                {activeWishCount}
              </span>
            )}
            <img className="size-5" src="images/ico_heart.png" alt="Wishlist" />
          </Link>

          <Link to="/shopping-cart" className="relative">
            <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
            <img className="size-5" src="images/ico_bag.png" alt="Giỏ hàng" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
