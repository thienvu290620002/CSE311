import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Category = () => {
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

  const { addToCart } = useCart(); // Lấy hàm addToCart từ context
  const { addToWishlist } = useWishlist();

  const handleAddToCart = (product) => {
    // Tách quantity tồn kho ra
    const { quantity, ...productInfo } = product;

    // Gửi bản sao không chứa quantity tồn kho
    addToCart(productInfo);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  return (
    <div>
      {/* Categories Section */}
      <section className="mt-8 lg:mt-24">
        <div className="container mx-auto w-11/12">
          <div className="lg:flex justify-between items-center">
            <h2 className="text-3xl font-bold">Our Categories</h2>
            <Link
              to="#"
              className="mt-6 lg:mt-0 h-9 border border-black px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
            >
              View All
            </Link>
          </div>

          <ul className="mt-10 md:grid grid-cols-3 gap-10 cursor-pointer">
            {[
              { img: "/images/img_collection.jpg", label: "Living Room" },
              { img: "/images/img_collection2.webp", label: "Bed room" },
              { img: "/images/img_collection3.webp", label: "Bath room" },
            ].map((item, index) => (
              <li key={index} className="mt-6 md:mt-0">
                <Link
                  to={`/category/${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="rounded-[20px] overflow-hidden relative group">
                    <img
                      className="w-full h-auto"
                      src={item.img}
                      alt={item.label}
                    />
                    <div className="absolute group-hover:bottom-10 left-1/2 -translate-x-1/2 -bottom-10 mt-8 h-9 bg-white px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300">
                      {item.label}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bestseller Section */}
      <section className="mt-9 lg:mt-24 pt-16 pb-8 bg-gray">
        <div className="container mx-auto w-11/12">
          <div className="lg:flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">Bestseller</h2>
              <p className="mt-2 text-lightGray">
                Experience the best products at our store!
              </p>
            </div>
            <Link
              to="/shop"
              className="mt-6 lg:mt-0 h-9 border border-black px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
            >
              View All
            </Link>
          </div>

          <ul className="mt-8 lg:grid grid-cols-4 gap-7">
            {products.slice(0, 4).map((product) => (
              <li
                key={product.id}
                className="mt-6 md:mt-0 text-center group relative"
                onClick={(e) => e.stopPropagation()} // Ngừng sự kiện click ở đây
              >
                <div className="relative">
                  {/* Sale Banner */}
                  {product.sale && (
                    <span className="absolute py-1 text-xs px-2 top-3 left-3 bg-red-600 text-white rounded-xl">
                      -{product.salePercentage}%
                    </span>
                  )}

                  {/* Product Image */}
                  <div className="rounded-xl overflow-hidden bg-white lg:h-[385px]">
                    <Link to={`/productdetail/${product.id}`}>
                      <img
                        className="block size-full object-cover"
                        src={product.image}
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

                  {/* Star Rating */}
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

                  {/* Product Name + Price */}
                  <h3 className="text-15 mt-2">{product.productName}</h3>
                  <div className="mt-2 relative h-7 overflow-hidden">
                    <div className="absolute left-1/2 -translate-x-1/2 group-hover:bottom-0 -bottom-5 transition-all duration-300">
                      <div className="flex items-center justify-center font-bold text-15 text-center">
                        <span className={product.sale ? "text-red-600" : ""}>
                          {product.sale && product.originalPrice && (
                            <>
                              <span className="line-through text-lightGray mr-1">
                                <sup className="text-[10px] align-middle">
                                  ₫
                                </sup>
                                {product.originalPrice}.000
                              </span>
                              -{" "}
                            </>
                          )}
                          <sup className="text-[10px] align-middle">₫</sup>
                          {product.productPrice}.000
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)} // Đảm bảo bạn gọi hàm đúng cách với đối số là sản phẩm
                        className="mt-2 text-sm text-black font-bold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom Category Section */}
      <section className="mt-9 lg:mt-24">
        <div className="container mx-auto w-11/12">
          <h2 className="text-3xl font-bold text-center">Our Categories</h2>

          <ul className="md:grid grid-cols-4 gap-10 mt-11">
            {[
              { label: "Bathroom", img: "/images/img_category.webp" },
              { label: "Chair", img: "/images/img_category2.webp" },
              { label: "Decor", img: "/images/img_category3.webp" },
              { label: "Lamp", img: "/images/img_category4.webp" },
            ].map((cat, index) => (
              <li key={index} className="mt-6 md:mt-0">
                <Link to="#">
                  <div className="rounded-lg overflow-hidden group">
                    <img
                      className="image transform group-hover:scale-110 transition-transform duration-300"
                      src={cat.img}
                      alt={cat.label}
                    />
                  </div>
                  <h3 className="mt-4 font-semibold">{cat.label}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Category;
