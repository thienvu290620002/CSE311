import React, { createContext, useContext, useState, useEffect } from "react";
import swal from "sweetalert";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map((item) => ({
        ...item,
        quantity:
          typeof item.quantity === "number"
            ? item.quantity
            : item.productWishLists?.quantity || 1,
      }));
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState([]);

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/get-all-product",
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching product list:", error);
      }
    };

    fetchProducts();
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Normalize product object to a standard format
  const normalizeProduct = (product) => {
    const base = product.productWishLists ?? product;
    // console.log(base, "normalizedProduct");

    return {
      id: base.id,
      productId: base.productId ?? base.id,
      productName: base.productName ?? "No Name",
      productPrice: base.productPrice ?? 0,
      image: base.image ?? "/images/default.jpg",
      quantity: base.quantity ?? 1,
    };
  };

  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    const productInStock = products.find(
      (p) =>
        p.id === normalized.productId || p.productId === normalized.productId,
    );
    const stock = productInStock?.quantity ?? 1;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === normalized.productId,
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + normalized.quantity;

        if (newQuantity > stock) {
          swal(
            "Out of Stock",
            `Maximum available quantity for "${normalized.productName}" is ${stock}.`,
            "warning",
          );
          return prevItems;
        }

        swal("Updated", "Quantity updated successfully!", "success");

        return prevItems.map((item) =>
          item.productId === normalized.productId
            ? { ...item, quantity: newQuantity }
            : item,
        );
      } else {
        if (normalized.quantity > stock) {
          swal("Out of Stock", `Only ${stock} items left in stock.`, "warning");
          return prevItems;
        }

        swal("Success", "Added to cart successfully!", "success");

        // Sửa chỗ này:
        return [...prevItems, { ...normalized, quantity: normalized.quantity }];
      }
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
