import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/get-all-product"
        );
        const data = await response.json();
        //console.log(data);

        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("1");

  const sortProducts = (products, option) => {
    const sorted = [...products];
    switch (option) {
      case "1":
        return sorted.sort((a, b) => a.productPrice - b.productPrice); // Low to high
      case "2":
        return sorted.sort((a, b) => b.productPrice - a.productPrice); // High to low
      case "3":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        ); // Old to New
      case "4":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // New to Old
      default:
        return products;
    }
  };

  const filteredProducts = products
    .filter((product) => {
      // Lọc theo category (nếu có)
      if (selectedCategory) {
        return product.categoryType.toUpperCase() === selectedCategory;
      }
      return true; // Nếu không có category nào được chọn, không cần lọc theo category
    })
    .filter((product) => {
      // Lọc theo availability (còn hàng hoặc hết hàng)
      if (availabilityFilter === "inStock") {
        return product.quantity > 0; // Chỉ hiển thị sản phẩm còn hàng
      } else if (availabilityFilter === "outOfStock") {
        return product.quantity === 0; // Chỉ hiển thị sản phẩm hết hàng
      }
      return true; // Nếu không có bộ lọc availability nào, hiển thị tất cả sản phẩm
    });

  // Tính số lượng sản phẩm còn hàng và hết hàng
  const inStockCount = products.filter(
    (product) => product.quantity > 0
  ).length;
  const outOfStockCount = products.filter(
    (product) => product.quantity === 0
  ).length;

  const { addToWishlist } = useWishlist();

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const { addToCart } = useCart(); // Lấy hàm addToCart từ context

  const handleAddToCart = (product) => {
    // Tách quantity tồn kho ra
    const { quantity, ...productInfo } = product;

    // Gửi bản sao không chứa quantity tồn kho
    addToCart(productInfo);
  };

  return (
    <div className="wrap">
      <main>
        <section className="relative">
          <img src="./images/img_product_list_banner.webp" alt="" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-4xl font-semibold">Products</h2>
            <ul className="flex items-center gap-3 justify-center mt-2">
              <li>
                <Link to="/">Home / </Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="pt-12 pb-12">
          <div className="container">
            <div className="lg:grid grid-cols-5">
              <div className="col-span-1 p-0 lg:p-4">
                <div>
                  <h2 className="text-lg font-semibold">Category</h2>
                  <ul className="mt-4 space-y-3">
                    {["CHAIR", "DECOR", "LAMP", "TABLE"].map((category) => (
                      <li key={category}>
                        <Link
                          to="#"
                          className={`font-medium text-sm transition-all ${selectedCategory === category ? "text-black" : "text-lightGray hover:text-black"}`}
                          onClick={() => {
                            setSelectedCategory(category);
                          }}
                        >
                          {category} (
                          {
                            products.filter(
                              (product) =>
                                product.categoryType &&
                                product.categoryType.toUpperCase() === category
                            ).length
                          }
                          )
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5">
                  <h2 className="text-lg font-semibold">Availability</h2>
                  <ul className="mt-4 space-y-3">
                    <li>
                      <Link
                        to="#"
                        className="font-medium text-lightGray text-sm hover:text-black transition-all"
                        onClick={() => {
                          setAvailabilityFilter("all"); // Reset availability filter
                          setSelectedCategory(""); // Reset category filter
                        }}
                      >
                        All
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="font-medium text-black text-sm hover:text-black transition-all"
                        onClick={() => {
                          setAvailabilityFilter("inStock");
                          setSelectedCategory("");
                        }}
                      >
                        In stock ({inStockCount})
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="font-medium text-lightGray text-sm hover:text-black transition-all"
                        onClick={() => {
                          setAvailabilityFilter("outOfStock");
                          setSelectedCategory("");
                        }}
                      >
                        Out of stock ({outOfStockCount})
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-span-4 mt-6 lg:mt-0">
                <div className="py-2 px-3 border rounded-full cursor-pointer w-max">
                  <select
                    onChange={(e) => setSortOption(e.target.value)}
                    value={sortOption}
                  >
                    <option value="1">Price: Low to High</option>
                    <option value="2">Price: High to Low</option>
                    <option value="3">Old to New</option>
                    <option value="4">New to Old</option>
                  </select>
                </div>

                <ul className="mt-8 lg:grid grid-cols-4 gap-7">
                  {sortProducts(filteredProducts, sortOption)
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((product) => (
                      <li
                        key={product.id}
                        className="mt-6 md:mt-0 text-center group relative"
                      >
                        <div className="rounded-xl overflow-hidden bg-white lg:h-[385px]">
                          <Link to={`/productdetail/${product.productId}`}>
                            <img
                              className="block size-full object-cover"
                              src={`http://localhost:8080${product.image}`}
                              alt={product.productName}
                            />
                          </Link>
                        </div>

                        <ul className="absolute bottom-28 left-4 z-10 flex flex-col gap-3">
                          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                            <button
                              className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToWishlist(product);
                              }}
                            >
                              <img
                                src="../images/ico_heart.png"
                                className="image size-4 rounded-full"
                                alt=""
                              />
                            </button>
                          </li>
                          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-100">
                            <button
                              type="button"
                              className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all"
                            >
                              <img
                                src="../images/ico_reload.png"
                                className="image size-4 rounded-full"
                                alt=""
                              />
                            </button>
                          </li>
                          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-200">
                            <button
                              type="button"
                              className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all"
                            >
                              <img
                                src="../images/ico_search.png"
                                className="image size-4 rounded-full"
                                alt=""
                              />
                            </button>
                          </li>
                        </ul>

                        <div className="flex justify-center items-center gap-1 mt-5">
                          {[...Array(5)].map((_, index) => (
                            <img
                              key={index}
                              className="size-4"
                              src={
                                index < product.rating
                                  ? "/images/ico_star_active.png"
                                  : "/images/ico_star_gray.png"
                              }
                              alt="star"
                            />
                          ))}
                        </div>

                        <h3 className="text-15 mt-2">{product.productName}</h3>
                        <div className="mt-2 relative h-7 overflow-hidden">
                          <div className="absolute left-1/2 -translate-x-1/2 group-hover:bottom-0 -bottom-5 transition-all duration-300">
                            <div className="flex items-center justify-center font-bold text-15 text-center">
                              <span
                                className={product.sale ? "text-red-600" : ""}
                              >
                                {product.sale && product.originalPrice && (
                                  <>
                                    <span className="line-through text-lightGray mr-1">
                                      <sup className="text-[10px] align-middle">
                                        ₫
                                      </sup>
                                      {product.originalPrice / 1000}
                                    </span>
                                    -{" "}
                                  </>
                                )}
                                <sup className="text-[10px] align-middle"></sup>
                                {product.productPrice.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                            <button
                              className="uppercase text-xs font-medium tracking-widest relative mt-1 before:absolute before:bottom-0 before:w-0 before:h-[1px] before:bg-black before:left-0 hover:before:w-full before:transition-all before:duration-500"
                              onClick={() => handleAddToCart(product)}
                            >
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>

                <div className="mt-10">
                  <ul className="flex items-center justify-center gap-2 mt-6">
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="grid place-items-center size-10 rounded-full border border-lightGray"
                      >
                        <img
                          className="size-4"
                          src="./images/ico_chevron_left.png"
                          alt="prev"
                        />
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1}>
                        <button
                          onClick={() => setCurrentPage(i + 1)}
                          className={`grid place-items-center size-10 rounded-full border border-lightGray transition-all ${
                            currentPage === i + 1
                              ? "bg-black text-white"
                              : "hover:bg-black hover:text-white"
                          }`}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="grid place-items-center size-10 rounded-full border border-lightGray"
                      >
                        <img
                          className="size-4"
                          src="./images/ico_chevron_right.png"
                          alt="next"
                        />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductList;
