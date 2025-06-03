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
          "http://localhost:8080/api/get-all-product"
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

  // const addToCart = (product) => {
  //   const normalized = normalizeProduct(product);
  //   const productInStock = products.find(
  //     (p) =>
  //       p.id === normalized.productId || p.productId === normalized.productId
  //   );
  //   const stock = productInStock?.quantity ?? 1;

  //   setCartItems((prevItems) => {
  //     const existingItem = prevItems.find(
  //       (item) => item.productId === normalized.productId
  //     );

  //     if (existingItem) {
  //       const newQuantity = existingItem.quantity + normalized.quantity;

  //       if (newQuantity > stock) {
  //         swal(
  //           "Out of Stock",
  //           `Maximum available quantity for "${normalized.productName}" is ${stock}.`,
  //           "warning"
  //         );

  //         return prevItems;
  //       }

  //       // toast.dismiss(); // hủy toast cũ nếu có
  //       swal("Updated", "Quantity updated successfully!", "success", {
  //         position: "bottom-right",
  //         autoClose: 800,
  //         toastId: `success-${normalized.productId}`,
  //       });

  //       return prevItems.map((item) =>
  //         item.productId === normalized.productId
  //           ? { ...item, quantity: newQuantity }
  //           : item
  //       );
  //     } else {
  //       if (normalized.quantity > stock) {
  //         toast.warn(`Only ${stock} items left in stock.`, {
  //           position: "bottom-right",
  //           autoClose: 1000,
  //           toastId: `warn-${normalized.productId}`,
  //         });
  //         return prevItems;
  //       }

  //       toast.dismiss();
  //       toast.success("Added to cart successfully!", {
  //         position: "bottom-right",
  //         autoClose: 800,
  //         toastId: `success-${normalized.productId}`,
  //       });

  //       return [...prevItems, { ...normalized, quantity: 1 }];
  //     }
  //   });
  // };
  // const addToCart = (product) => {
  //   const normalized = normalizeProduct(product);
  //   const productInStock = products.find(
  //     (p) =>
  //       p.id === normalized.productId || p.productId === normalized.productId
  //   );
  //   const stock = productInStock?.quantity ?? 1;

  //   setCartItems((prevItems) => {
  //     const existingItem = prevItems.find(
  //       (item) => item.productId === normalized.productId
  //     );

  //     if (existingItem) {
  //       const newQuantity = existingItem.quantity + normalized.quantity;

  //       if (newQuantity > stock) {
  //         swal(
  //           "Out of Stock",
  //           `Maximum available quantity for "${normalized.productName}" is ${stock}.`,
  //           "warning"
  //         );
  //         return prevItems;
  //       }

  //       swal("Updated", "Quantity updated successfully!", "success");

  //       return prevItems.map((item) =>
  //         item.productId === normalized.productId
  //           ? { ...item, quantity: newQuantity }
  //           : item
  //       );
  //     } else {
  //       if (normalized.quantity > stock) {
  //         swal("Out of Stock", `Only ${stock} items left in stock.`, "warning");
  //         return prevItems;
  //       }

  //       swal("Success", "Added to cart successfully!", "success");

  //       return [...prevItems, { ...normalized, quantity: 1 }];
  //     }
  //   });
  // };
  // const addToCart = (product) => {
  //   const normalized = normalizeProduct(product);
  //   const productInStock = products.find(
  //     (p) =>
  //       p.id === normalized.productId || p.productId === normalized.productId
  //   );
  //   const stock = productInStock?.quantity ?? 1;

  //   setCartItems((prevItems) => {
  //     const existingItem = prevItems.find(
  //       (item) => item.productId === normalized.productId
  //     );

  //     if (existingItem) {
  //       const newQuantity = existingItem.quantity + normalized.quantity;

  //       if (newQuantity > stock) {
  //         swal(
  //           "Out of Stock",
  //           // `Maximum available quantity for "${normalized.productName}" is ${stock}.`,
  //           "warning"
  //         );
  //         return prevItems;
  //       }

  //       swal("Updated", "Quantity updated successfully!", "success");

  //       return prevItems.map((item) =>
  //         item.productId === normalized.productId
  //           ? { ...item, quantity: newQuantity }
  //           : item
  //       );
  //     } else {
  //       if (normalized.quantity > stock) {
  //         swal("Out of Stock", "warning");
  //         return prevItems;
  //       }

  //       // swal("Success", "Added to cart successfully!", "success");

  //       // Sửa chỗ này:
  //       return [...prevItems, { ...normalized, quantity: normalized.quantity }];
  //     }
  //   });
  // };
  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    const productInStock = products.find(
      (p) =>
        p.id === normalized.productId || p.productId === normalized.productId
    );
    const stock = productInStock?.quantity ?? 1;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === normalized.productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + normalized.quantity;

        if (newQuantity > stock) {
          swal({
            title: "Out of Stock",
            text: `Only ${stock} items available in stock.`,
            icon: "warning",
            timer: 1500,
            buttons: false,
          });
          return prevItems;
        }

        swal({
          title: "Updated",
          text: `"Quantity updated successfully!"`,
          icon: "success",
          timer: 1500,
          buttons: false,
        });
        // swal("Updated", "Quantity updated successfully!", "success");

        return prevItems.map((item) =>
          item.productId === normalized.productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (normalized.quantity > stock) {
          swal({
            title: "Out of Stock",
            text: `Only ${stock} items available in stock.`,
            icon: "error",
            timer: 1500,
            buttons: false,
          });
          return prevItems;
        }

        swal("Success", "Added to cart successfully!", "success");

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
