import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ShoppingCart = () => {
  const { cartItems, setCartItems } = useCart();

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?",
      )
    ) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.productPrice * item.quantity,
    0,
  );

  return (
    <div className="wrap">
      <main>
        <section>
          <div className="pt-10">
            <h2 className="text-3xl font-semibold text-center">
              Shopping Cart
            </h2>

            <div className="container">
              <div className="grid grid-cols-6 mt-5 gap-8">
                <div className="col-span-4">
                  <div className="border border-gray rounded-lg">
                    <div className="grid grid-cols-4 gap-0">
                      <div className="p-5 border border-gray flex items-center justify-center">
                        Product
                      </div>
                      <div className="p-5 border border-gray flex items-center justify-center">
                        Quantity
                      </div>
                      <div className="p-5 border border-gray flex items-center justify-center">
                        Total
                      </div>
                      <div className="p-5 border border-gray flex items-center justify-center"></div>
                    </div>

                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-4 gap-0 border-b items-center"
                      >
                        {/* Product Image */}
                        <div className="p-4 flex items-center gap-3">
                          <div className="w-20 h-20 overflow-hidden flex-shrink-0">
                            <img
                              className="object-cover w-full h-full"
                              src={item.image}
                              alt={item.productName}
                            />
                          </div>
                          <div>
                            <p className="text-xs uppercase">
                              {item.productName}
                            </p>
                            <span className="text-xs">
                              $
                              {typeof item.productPrice === "number"
                                ? item.productPrice.toFixed(2)
                                : Number(item.productPrice).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Control */}
                        <div className="p-4 flex justify-center">
                          <div className="flex items-center w-max relative">
                            <button
                              type="button"
                              className="absolute left-2"
                              onClick={() => decreaseQuantity(item.id)}
                            >
                              <span className="text-2xl leading-[24px]">-</span>
                            </button>
                            <input
                              type="text"
                              className="w-[70px] h-[40px] border px-4 border-black rounded-full text-center"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              type="button"
                              className="absolute right-2"
                              onClick={() => increaseQuantity(item.id)}
                            >
                              <span className="text-2xl leading-[24px]">+</span>
                            </button>
                          </div>
                        </div>

                        {/* Total Price */}
                        <div className="p-4 flex justify-center">
                          ${(item.productPrice * item.quantity).toFixed(2)}
                        </div>

                        {/* Remove from Cart Button */}
                        <div className="p-4 flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <img
                              className="block size-5"
                              src="images/ico_trash.png"
                              alt="Delete"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="p-7 bg-[#f7f4ef] rounded-lg">
                    <h3 className="uppercase font-medium text-sm">
                      FREE SHIPPING ON ORDERS $100.00
                    </h3>
                    <p className="text-sm mt-2">
                      Congratulations, you've got free shipping!
                    </p>
                    <p className="bg-[#14c100] w-full h-1 mt-5"></p>
                  </div>

                  <div className="p-6 mt-4 bg-[#f6f6f6] rounded-lg">
                    <span>Coupon</span>
                    <p className="mt-2 mb-6 text-md text-lightGray">
                      * Discount will be calculated and applied at checkout
                    </p>
                    <input
                      type="text"
                      className="h-10 px-6 text-sm border border-gray rounded-md w-full"
                      placeholder="Coupon code"
                    />
                    <p className="mt-6 font-semibold">
                      Total: ${total.toFixed(2)}
                    </p>

                    <Link
                      to="/checkout"
                      className="flex items-center justify-center h-[50px] mt-6 bg-black w-full text-white font-semibold text-sm px-4 flex-1 rounded-full hover:bg hover:bg-white border hover:border-black hover:text-black transition-all"
                    >
                      Check out
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-12 pb-12"></section>
      </main>
    </div>
  );
};

export default ShoppingCart;
