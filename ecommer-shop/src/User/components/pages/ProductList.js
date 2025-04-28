import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts([
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
      ]);
    }
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
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        ); // Old to New
      case "4":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ); // New to Old
      default:
        return products;
    }
  };

  const filteredProducts = products
    .filter((product) => {
      // Lọc theo category (nếu có)
      if (selectedCategory) {
        return product.categoryType === selectedCategory;
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
    (product) => product.quantity > 0,
  ).length;
  const outOfStockCount = products.filter(
    (product) => product.quantity === 0,
  ).length;

  const [setWishlist] = useState([]);

  const handleAddToWishlist = (product) => {
    console.log(product);
    setWishlist((prevWishlist) => {
      if (prevWishlist.find((item) => item.id === product.id)) {
        return prevWishlist; // Sản phẩm đã có trong wishlist rồi
      }
      return [...prevWishlist, product]; // Thêm sản phẩm vào wishlist
    });
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
                    {["Bathroom", "Chair", "Decor", "Lamp", "Table"].map(
                      (category) => (
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
                                (product) => product.categoryType === category,
                              ).length
                            }
                            )
                          </Link>
                        </li>
                      ),
                    )}
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
                  {sortProducts(filteredProducts, sortOption).map((product) => (
                    <li
                      key={product.id}
                      className="mt-6 md:mt-0 text-center group relative"
                    >
                      <Link to={`/productdetail/${product.id}`}>
                        {product.sale && (
                          <span className="absolute py-1 text-xs px-2 top-3 left-3 bg-red-600 text-white rounded-xl">
                            -30%
                          </span>
                        )}
                        <div className="rounded-xl overflow-hidden bg-white lg:h-[385px]">
                          <img
                            className="block size-full object-cover"
                            src={product.image}
                            alt={product.productName}
                          />
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
                                className="image size-4 rouded-full"
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
                                className="image size-4 rouded-full"
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
                                className="image size-4 rouded-full"
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
                        <div className="mt-2 relative h-5 overflow-hidden">
                          <div className="absolute left-1/2 -translate-x-1/2 group-hover:bottom-0 -bottom-5 transition-all duration-300">
                            <div className="flex items-center justify-center font-bold text-15 text-center">
                              <span
                                className={product.sale ? "text-red-600" : ""}
                              >
                                {product.sale && product.originalPrice && (
                                  <>
                                    <span className="line-through text-lightGray mr-1">
                                      {product.originalPrice}$
                                    </span>
                                    -{" "}
                                  </>
                                )}
                                {product.productPrice}$
                              </span>
                            </div>
                            <button className="uppercase text-xs font-medium tracking-widest relative mt-1 before:absolute before:bottom-0 before:w-0 before:h-[1px] before:bg-black before:left-0 hover:before:w-full before:transition-all before:duration-500">
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <ul className="flex items-center justify-center gap-2">
                    <li>
                      <button className="grid place-items-center size-10 rounded-full border border-lightGray">
                        <img
                          className="size-4"
                          src="./images/ico_chevron_left.png"
                          alt=""
                        />
                      </button>
                    </li>
                    <li>
                      <Link
                        to={"/home"}
                        className="grid place-items-center size-10 rounded-full border border-lightGray hover:text-white hover:bg-black transition-all bg-black text-white"
                      >
                        1
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="grid place-items-center size-10 rounded-full border border-lightGray hover:text-white hover:bg-black transition-all"
                        to="#none"
                      >
                        2
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="grid place-items-center size-10 rounded-full border border-lightGray hover:text-white hover:bg-black transition-all"
                        to="#none"
                      >
                        3
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="grid place-items-center size-10 rounded-full border border-lightGray hover:text-white hover:bg-black transition-all"
                        to="#none"
                      >
                        4
                      </Link>
                    </li>
                    <li>
                      <button className="grid place-items-center size-10 rounded-full border border-lightGray">
                        <img
                          className="size-4"
                          src="./images/ico_chevron_right.png"
                          alt=""
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
