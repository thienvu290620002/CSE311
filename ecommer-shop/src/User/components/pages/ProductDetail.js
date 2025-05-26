import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductDetail = () => {
<<<<<<< HEAD
  // const { productId } = useParams(); // Get id from URL
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
  const { addToCart } = useCart(); // Add to cart function from context
  const { addToWishlist } = useWishlist(); // Add to wishlist function
  const [activeTab, setActiveTab] = useState("description");

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null); // Single product
  const [selectedImage, setSelectedImage] = useState(null); // Selected image state

  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const getImageSrc = (img) => {
    return img?.startsWith("http") ? img : `http://localhost:8080${img}`;
  };
  const { productId } = useParams(); // Get id from URL
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `http://localhost:8080/api/get-product-by-productId?productId=${productId}`
=======
          `http://localhost:8080/api/get-product-by-productId?productId=${productId}`,
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
        );

        if (!response.ok) {
          throw new Error("Sản phẩm không tồn tại");
        }
        const result = await response.json();
        console.log("Fetched product:", result.data.image);
        setProduct(result.data);
        //  setSelectedImage(result.data.image);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(
<<<<<<< HEAD
          "http://localhost:8080/api/get-all-product"
=======
          "http://localhost:8080/api/get-all-product",
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
        );
        if (!response.ok) {
          throw new Error("Không thể lấy danh sách sản phẩm");
        }
        const result = await response.json();
        // console.log("Tất cả sản phẩm:", result);

        setProducts(result); // Đảm bảo API trả về { data: [...] }
      } catch (error) {
        console.error("Lỗi khi lấy tất cả sản phẩm:", error.message);
      }
    };

    fetchAllProducts();
  }, []);
<<<<<<< HEAD
=======

  // const handleAddToCart = (product) => {
  //   const { quantity, ...productInfo } = product;
  //   addToCart(productInfo);
  // };
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8

  const handleAddToCart = (product) => {
  const productWithQuantity = {
    ...product,
    quantity: quantity,
  };
  addToCart(productWithQuantity);
};


  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  if (!product) {
    return (
      <p className="text-center text-red-500 mt-10">Sản phẩm không tồn tại.</p>
    );
  }
  // swal({
  //   icon: "success",
  // });

  return (
    <div>
      <main>
        <div className="container">
          <ul className="flex gap-2 items-center py-4">
            <li>
              <Link className="text-sm" href="/home">
                Home /{" "}
              </Link>
            </li>
            <li>
              <Link className="text-sm" href="/shop">
                Shop /{" "}
              </Link>
            </li>
            <li>
              <Link className="text-sm">{product.productName}</Link>
            </li>
          </ul>

          <div className="lg:grid grid-cols-5 gap-7 mt-4">
            <div className="col-span-3 flex gap-3">
              <ul className="flex flex-col gap-4">
                {[product.image]

                  .filter((img) => img && img.trim() !== "")

                  .map((img, index) => (
                    <li
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-[82px] cursor-pointer p-[10px] rounded-md border ${
                        selectedImage === img
                          ? "border-black"
                          : "border-transparent"
                      } hover:border-black transition-all`}
                    >
                      <img
                        className="image"
                        src={`http://localhost:8080${img}`}
                        alt={product.productName}
                      />
                    </li>
                  ))}
              </ul>
<<<<<<< HEAD

              {/* <div className="overflow-hidden">
=======
              <div className="overflow-hidden">
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
                <div
                  className="relative overflow-hidden rounded-xl w-[700px] h-[805px] group"
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setShowZoom(false)}
                >
                  <img
<<<<<<< HEAD
                    src={`http://localhost:8080${product.image}`}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                    // alt="Main product"
=======
                    src={getImageSrc(product.image)}
                    alt={product.productName}
                    className="w-full h-full object-cover"
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
                  />
                  {showZoom && (
                    <div
                      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                      style={{
                        backgroundImage: `url(${getImageSrc(selectedImage || product.image)})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: "150%",
                        border: "3px solid black", // For debug
                      }}
                    />
                  )}
                </div>
              </div> */}
              <div className="overflow-hidden">
                <div
                  className="relative overflow-hidden rounded-xl w-[700px] h-[805px] group"
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setShowZoom(false)}
                >
                  <img
                    src={getImageSrc(product.image)}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                  {showZoom && (
                    <div
                      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                      style={{
                        backgroundImage: `url(${getImageSrc(selectedImage || product.image)})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: "150%",
                        border: "3px solid black", // For debug
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-2 mt-6">
              <h2 className="text-xl lg:text-3xl font-semibold">
                {product.productName}
              </h2>
              <div className="flex items-center gap-1 mt-4">
                {[...Array(5)].map((_, index) => (
                  <img
                    key={index}
                    className="size-[16px]"
                    src={
                      index < product.rating
                        ? "/images/ico_star_active.png"
                        : "/images/ico_star_gray.png"
                    }
                    alt="star"
                  />
                ))}
              </div>

              <span className="text-red-600 font-bold text-xl mr-1">
                {product.productPrice.toLocaleString("vi-VN")}
                <sup className="text-[10px] align-middle">₫</sup>
              </span>

              <div className="mt-2 pt-2 border-t border-gray">
                <p className="flex items-center gap-2 mt-2">
                  <img
                    className="w-5 block animate-flicker"
                    src="../images/ico_eye.png"
                    alt=""
                  />
                  <span className="font-medium text-sm">
                    35 people are viewing this right now
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-4">
                  <img
                    className="w-5 block animate-zoomInOut"
                    src="../images/ico_fire.png"
                    alt=""
                  />
                  <span className="text-red-600 font-medium text-sm">
                    35 sold in last 18 hours
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-6">
                  <img
                    className="w-5 block"
                    src="../images/ico_checked.png"
                    alt=""
                  />{" "}
                  <span className="text-green font-medium text-sm">
                    In stock
                  </span>
                </p>

                <p className="mt-5 text-midGray">
                  Curabitur egestas malesuada volutpat. Nunc vel vestibulum
                  odio, ac pellentesque lacus. Pellentesque dapibus nunc nec est
                  imperdiet, a malesuada sem rutrum
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center w-max relative">
                    <button
                      type="button"
                      className="text-lg block text-[0px] absolute left-4"
                      onClick={handleDecrease}
                    >
                      <span className="text-2xl leading-[24px]">-</span>
                    </button>
                    <input
                      type="text"
                      className="w-[120px] h-[50px] border px-10 border-gray rounded-full text-center"
                      value={quantity}
                      readOnly
                    />
                    <button
                      type="button"
                      className="text-lg block text-[0px] absolute right-4"
                      onClick={handleIncrease}
                    >
                      <span className="text-2xl leading-[24px]">+</span>
                    </button>
                  </div>

                  <button
  type="button"
  onClick={() => handleAddToCart(product)}
  className="h-[50px] bg-black text-white font-semibold text-sm px-4 flex-1 rounded-full hover:bg hover:bg-white border hover:border-black hover:text-black transition-all"
>
  Add To Cart
</button>

                  <button
                    className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product);
                    }}
                  >
<<<<<<< HEAD
                    Add To Cart
                  </button>

                  {/* <button type="button" className="p-4 bg-white rounded-full">
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
                  </button> */}
                  <button
                    className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product);
                    }}
                  >
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
                    <img
                      src="../images/ico_heart.png"
                      className="image size-4 rounded-full"
                      alt=""
                    />
                  </button>
                </div>

                <ul className="flex items-center gap-4 mt-6">
                  <li>
                    <button
                      type="button"
                      className="flex items-center gap-4 text-sm font-medium"
                    >
                      <img
                        className="w-4"
                        src="../images/ico_reload.png"
                        alt=""
                      />
                      Compare
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex items-center gap-4 text-sm font-medium"
                    >
                      <img
                        className="w-4"
                        src="../images/ico_question.png"
                        alt=""
                      />
                      Question
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex items-center gap-4 text-sm font-medium"
                    >
                      <img
                        className="w-4"
                        src="../images/ico_shipping.png"
                        alt=""
                      />
                      Shipping info
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex items-center gap-4 text-sm font-medium"
                    >
                      <img
                        className="w-4"
                        src="../images/ico_share.png"
                        alt=""
                      />
                      Share
                    </button>
                  </li>
                </ul>

                <div className="flex items-center mt-6 mb-6 pt-6 pb-6 border-t border-b border-b-gray border-t-gray">
                  <div>
                    <img
                      className="block w-9"
                      src="../images/ico_shipping2.png"
                      alt=""
                    />
                  </div>
                  <p className="flex-1 ml-4 pl-4 border-l border-l-[#d9d9d9] text-sm">
                    Order in the next 22 hours 45 minutes to get it between{" "}
                    <br />
                    <span className="font-semibold underline">
                      Tuesday, Oct 22{" "}
                    </span>{" "}
                    <span className="mx-2">and</span>
                    <span className="font-semibold underline">
                      {" "}
                      Saturday, Oct 26
                    </span>
                  </p>
                </div>

                <div className="p-[15px] rounded-xl border border-[#dedede] flex items-start gap-3">
                  <div>
                    <img
                      src="../images/ico_check.png"
                      className="w-6 block"
                      alt=""
                    />
                  </div>
                  <div className="text-sm">
                    <p className="text-lightGray">
                      Pickup available at{" "}
                      <span className="font-semibold text-black">
                        {" "}
                        Akaze store
                      </span>
                    </p>
                    <p className="text-xs text-lightGray mt-1">
                      Usually ready in 24 hours
                    </p>
                    <button type="button" className="underline text-xs mt-4">
                      View store information
                    </button>
                  </div>
                </div>

                <div className="text-center mt-6 p-6 bg-[#f6f6f6] rounded-lg">
                  <p className="text-sm tracking-widest">Guaranteed Checkout</p>
                  <img
                    className="block mt-3"
                    src="../images/img_payment.avif"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9 lg:mt-24">
            <ul className="flex items-center lg:justify-center gap-6">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`text-lg font-semibold py-2 px-4 rounded-full ${
                    activeTab === "description"
                      ? "bg-black text-white"
                      : "text-[#8a8a8a] hover:text-black transition-all"
                  }`}
                >
                  Description
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className={`lg:block hidden text-lg font-semibold py-2 px-4 ${
                    activeTab === "review"
                      ? "bg-black text-white"
                      : "text-[#8a8a8a] hover:text-black transition-all"
                  }`}
                >
                  Review
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab("shipping")}
                  className={`lg:block hidden text-lg font-semibold py-2 px-4 ${
                    activeTab === "shipping"
                      ? "bg-black text-white"
                      : "text-[#8a8a8a] hover:text-black transition-all"
                  }`}
                >
                  Shipping
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab("return")}
                  className={`lg:block hidden text-lg font-semibold py-2 px-4 ${
                    activeTab === "return"
                      ? "bg-black text-white"
                      : "text-[#8a8a8a] hover:text-black transition-all"
                  }`}
                >
                  Return
                </button>
              </li>
            </ul>

            <div className="mt-9 lg:mt-20 text-base leading-7">
              {activeTab === "description" && (
                <div className="bg-[#f9f9f9] p-6 rounded-xl shadow-md text-gray-800">
                  <h3 className="text-2xl font-semibold mb-3 text-black">
                    Product Description
                  </h3>
                  <p className="mb-4">{product.descriptions}</p>
                  <div className="text-sm text-gray-700">
                    <p className="text-center mb-2">
                      <span className="font-medium text-black">Size:</span>{" "}
                      {product.size}
                    </p>
                    <p className="text-center mb-2">
                      <span className="font-medium text-black">Price:</span> ₫
                      {product.productPrice.toLocaleString("vi-VN")}
                    </p>
                    <p className="text-center mb-2">
                      <span className="font-medium text-black">In Stock:</span>{" "}
                      {product.quantity} items
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "review" && (
                <div>
                  <p className="mb-3 text-yellow-600 font-medium">
                    ⭐ Average Rating:{" "}
                    <span className="font-bold">{product.rating}/5</span>
                  </p>
                  <ul className="list-inside ml-6 text-gray-700 space-y-1">
                    <li>Excellent build quality with a sleek design</li>
                    <li>Great value for its price range</li>
                    <li>Most customers recommend this product</li>
                  </ul>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="bg-blue-50 p-6 rounded-xl shadow-md text-blue-900">
                  <h3 className="text-2xl font-semibold mb-3">
                    Shipping Information 🚚
                  </h3>
                  <p className="mb-2">
                    📦 <strong>Standard Delivery:</strong> 3–5 business days.
                  </p>
                  <p className="mb-2">
                    ⚡ <strong>Express Delivery:</strong> 1–2 business days
                    (option at checkout).
                  </p>
                  <p className="text-sm text-blue-800 mt-2 italic">
                    Orders processed within 24 hours. Tracking code will be
                    emailed.
                  </p>
                </div>
              )}

              {activeTab === "return" && (
                <div className="bg-red-50 p-6 rounded-xl shadow-md text-red-900">
                  <h3 className="text-2xl font-semibold mb-3">
                    Return & Refund Policy 🔁
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Return within <strong>14 days</strong> from delivery date.
                    </li>
                    <li>Items must be in original condition and packaging.</li>
                    <li>
                      Refunds issued within 5 business days after return
                      approval.
                    </li>
                  </ul>
                  <p className="text-sm text-red-800 mt-3 italic">
                    Contact our support for any assistance regarding your
                    return.
                  </p>
                </div>
              )}
            </div>
          </div>

          <section className="mt-9 lg:mt-24 pt-16 pb-8 bg-gray">
            <div className="container mx-auto w-11/12">
              <div className="lg:flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold">You may also like</h2>
                </div>
                <Link
                  to="/shop"
                  className="mt-6 lg:mt-0 h-9 border border-black px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
                >
                  View All
                </Link>
              </div>

              <ul className="mt-8 lg:grid grid-cols-4 gap-7">
                {/* {products.slice(0, 4).map((product) => ( */}
                {Array.isArray(products) &&
                  products.slice(0, 4).map((product) => (
                    <li
                      key={product.productId}
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
                              <span
                                className={product.sale ? "text-red-600" : ""}
                              >
                                {product.sale && product.originalPrice && (
                                  <>
                                    <span className="line-through text-lightGray mr-1">
                                      <sup className="text-[10px] align-middle">
                                        ₫
                                      </sup>
                                      {product.originalPrice.toLocaleString(
<<<<<<< HEAD
                                        "vi-VN"
=======
                                        "vi-VN",
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
                                      )}
                                    </span>
                                    -{" "}
                                  </>
                                )}

                                {product.productPrice.toLocaleString("vi-VN")}
                                <sup className="text-[10px] align-middle">
                                  ₫
                                </sup>
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
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
