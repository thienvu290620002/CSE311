import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiRefreshCw, FiSearch } from "react-icons/fi";

const Category = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { user } = useContext(UserContext);

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

  const { addToCart } = useCart(); // Lấy hàm addToCart từ context
  // const { addToWishlist } = useWishlist();
  const { wishItems, setWishItems, addToWishlist } = useWishlist();

  // Kiểm tra sản phẩm có trong wishlist không
  const isInWishlist = (productId) => {
    return wishItems.some((item) => item.id === productId);
  };

  // Hàm toggle wishlist: nếu có thì xóa, không có thì thêm
  // const toggleWishlist = (product) => {
  //   if (!user) {
  //     swal({
  //       title: "Login Required!",
  //       text: "You need to log in to add this product to your wishlist.",
  //       icon: "warning",
  //       buttons: {
  //         cancel: "Back to Home",
  //         confirm: "Go to Login",
  //       },
  //       dangerMode: true,
  //     }).then((willLogin) => {
  //       if (willLogin) {
  //         navigate("/login");
  //       } else {
  //         navigate("/");
  //       }
  //     });
  //     return;
  //   }

  //   if (isInWishlist(product.id)) {
  //     // Xóa sản phẩm khỏi wishlist
  //     const newWishList = wishItems.filter((item) => item.id !== product.id);
  //     setWishItems(newWishList);
  //   } else {
  //     // Thêm sản phẩm vào wishlist
  //     addToWishlist(product);
  //   }
  // };

  const handleAddToCart = (product) => {
    // Tách quantity tồn kho ra
    const { quantity, ...productInfo } = product;

    // Gửi bản sao không chứa quantity tồn kho
    addToCart(productInfo);
  };
  const toggleWishlist = async (product) => {
    if (!user) {
      swal({
        title: "Login Required!",
        text: "You need to log in to add this product to your wishlist.",
        icon: "warning",
        buttons: {
          cancel: "Back to Home",
          confirm: "Go to Login",
        },
        dangerMode: true,
      }).then((willLogin) => {
        if (willLogin) {
          navigate("/login");
        } else {
          navigate("/");
        }
      });
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        // Nếu sản phẩm đã có trong wishlist → cập nhật trạng thái thành inactive
        await axios.post("http://localhost:8080/api/create-wishlist", {
          productId: product.id,
          userId: user.id,
          status: "inactive",
        });

        // Cập nhật state
        const newWishList = wishItems.filter((item) => item.id !== product.id);
        setWishItems(newWishList);
      } else {
        // Nếu chưa có → thêm wishlist mới (active)
        await axios.post("http://localhost:8080/api/create-wishlist", {
          productId: product.id,
          userId: user.id,
          status: "active",
        });

        addToWishlist(product);
      }
    } catch (error) {
      console.error("Lỗi xử lý wishlist:", error);
      swal("Error", "Có lỗi xảy ra khi cập nhật wishlist!", "error");
    }
  };

  // const handleAddToWishlist = (product) => {
  //   addToWishlist(product);
  // };

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
              { img: "/images/img_collection2.jpg", label: "Bed room" },
              { img: "/images/img_collection3.jpg", label: "Bath room" },
            ].map((item, index) => (
              <li key={index} className="mt-6 md:mt-0">
                <Link to={"/shop"}>
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  {/* Sale Banner */}
                  {product.sale && (
                    <span className="absolute py-1 text-xs px-2 top-3 left-3 bg-red-600 text-white rounded-xl">
                      -{product.salePercentage}%
                    </span>
                  )}

                  <div className="rounded-xl overflow-hidden bg-white lg:h-[385px] relative">
                    {/* Hiện trái tim ở góc phải nếu có trong wishlist */}
                    {isInWishlist(product.id) && (
                      <div className="absolute top-2 right-2 z-10">
                        <FaHeart size={24} color="red" />
                      </div>
                    )}

                    <Link to={`/productdetail/${product.productId}`}>
                      <img
                        className="block size-full object-cover"
                        src={`http://localhost:8080${product.image}`}
                        alt={product.productName}
                      />
                    </Link>
                  </div>

                  {/* Hover Actions */}
                  <ul className="absolute bottom-28 left-4 z-10 flex flex-col gap-3">
                    {/* Wishlist Button */}
                    <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      <button
                        className={
                          "shadow-lg p-3 rounded-full block transition-all bg-white hover:bg-slate-200"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                      >
                        {isInWishlist(product.id) ? (
                          <FaHeart size={24} color="red" />
                        ) : (
                          <FaRegHeart size={24} color="black" />
                        )}
                      </button>
                    </li>

                    {/* Refresh/Reload Button */}
                    <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-100">
                      <button
                        type="button"
                        className="shadow-lg p-3 rounded-full bg-white hover:bg-slate-200 transition-all"
                      >
                        <FiRefreshCw size={20} className="text-gray-600" />
                      </button>
                    </li>

                    {/* Search/View Button */}
                    <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-200">
                      <Link to={`/productdetail/${product.productId}`}>
                        <button
                          type="button"
                          className="shadow-lg p-3 rounded-full bg-white hover:bg-slate-200 transition-all"
                        >
                          <FiSearch size={20} className="text-gray-600" />
                        </button>
                      </Link>
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

                  {/* Product Name */}
                  <h3 className="text-15 mt-2">{product.productName}</h3>

                  {/* Price + Add to Cart */}
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
                                {product.originalPrice.toLocaleString("vi-VN")}
                              </span>
                              -{" "}
                            </>
                          )}
                          <sup className="text-[10px] align-middle">₫</sup>
                          {product.productPrice.toLocaleString("vi-VN")}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
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
              { label: "Bathroom", img: "/images/img_category.jpg" },
              { label: "Chair", img: "/images/img_category2.jpg" },
              { label: "Decor", img: "/images/img_category3.jpg" },
              { label: "Lamp", img: "/images/img_category4.jpg" },
            ].map((cat, index) => (
              <li key={index} className="mt-6 md:mt-0">
                <Link to="/shop">
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
