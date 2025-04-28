import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Header = () => {
  const products = [
    {
      id: 1,
      productId: "1",
      productName: "Caravaggio Read Wall Light",
      productPrice: 60,
      originalPrice: 59,
      sale: true,
      rating: 2,
      descriptions:
        "A stylish and functional wall-mounted reading light, perfect for bedrooms and cozy reading corners.",
      size: "20cm x 15cm x 12cm",
      image: "/images/img_product1.png",
      image1: "/images/img1_product1.png",
      image2: "/images/img2_product1.png",
      quantity: 5,
      categoryType: "",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: 2,
      productId: "2",
      productName: "Bouquet Flower Vase",
      productPrice: 59,
      originalPrice: null,
      sale: false,
      rating: 4,
      descriptions:
        "A beautifully crafted ceramic vase designed to showcase fresh or dried flowers elegantly.",
      size: "Height 25cm, Diameter 10cm",
      image: "/images/img_product2.png",
      image1: "/images/img1_product2.png",
      image2: "/images/img2_product2.png",
      quantity: 20,
      categoryType: "",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: 3,
      productId: "3",
      productName: "Egg Dining Table",
      productPrice: 100.0,
      originalPrice: null,
      sale: false,
      rating: 5,
      descriptions:
        "A modern and elegant dining table with a smooth oval surface, perfect for family meals and gatherings.",
      size: "180cm x 90cm x 75cm",
      image: "/images/img_product3.png",
      image1: "/images/img1_product3.png",
      quantity: 10,
      categoryType: "",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: 4,
      productId: "4",
      productName: "Century Starburst Clock",
      productPrice: 55,
      originalPrice: 60,
      sale: true,
      rating: 4,
      descriptions:
        "A vintage-inspired wall clock with a sunburst design, bringing retro charm to any room.",
      size: "50cm diameter",
      image: "/images/img_product.webp",
      quantity: 15,
      categoryType: "",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: 5,
      productId: "5",
      productName: "Cubic Plinth",
      productPrice: 135,
      originalPrice: 200,
      sale: true,
      rating: 2,
      descriptions:
        "A minimalist cubic plinth, ideal for displaying art, plants, or decorative items in a modern interior.",
      size: "40cm x 40cm x 40cm",
      image: "/images/img_product.webp",
      quantity: 5,
      categoryType: "",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
  ];

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const { cartItems, setCartItems } = useCart();
  const { wishItems } = useWishlist();

  // ✅ Hàm thêm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // ✅ Hàm xử lý tìm kiếm
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFiltered([]);
    } else {
      const results = products.filter((item) =>
        item.productName.toLowerCase().includes(value.toLowerCase()),
      );
      setFiltered(results);
    }
  };
  return (
    <header className="py-5 lg:py-8 sticky top-0 z-[60] bg-white shadow-lg">
      <div className="container flex items-center max-w-full px-4">
        <h1 className="flex-shrink-0 mr-5">
          <Link className="block max-w-[130px]" to="/home">
            <img className="max-w-full" src="images/logo.png" alt="Darion" />
          </Link>
        </h1>

        <div className="relative ml-auto lg:mr-20 max-w-[500px] w-full hidden xl:block z-50">
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
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-2 rounded-xl shadow-lg max-h-96 overflow-y-auto p-2 space-y-3 animate-fade-in z-50">
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className="hover:bg-amber-50 transition-all rounded-lg"
                >
                  <Link
                    to={`/ProductDetail/${item.id}`}
                    className="flex items-center gap-4 p-3"
                  >
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg shadow"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-800 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">View details</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-2 text-sm text-blue-600"
                  >
                    Add to Cart
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav className="mr-28 hidden lg:block ml-auto">
          <ul className="flex items-center gap-10">
            <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100">
              <Link to="/home">Home</Link>
            </li>
            <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100">
              <Link to="/shop">Shop</Link>
            </li>
            <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100">
              <Link to="/about-us">About us</Link>
            </li>
            <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100">
              <Link to="/blog">Blog</Link>
            </li>
            <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100">
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
            {Array.isArray(wishItems) && wishItems.length > 0 && (
              <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
                {wishItems.length}
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
