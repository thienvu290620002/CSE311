import React, { useState } from "react";
import { useProduct } from "./ProductContext";

const AdminProductPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleInput = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      updateProduct({ ...formData, id: editingId });
      setEditingId(null);
    } else {
      addProduct({ ...formData, id: Date.now() });
    }
    setFormData({ name: "", price: "", stock: "", image: "" });
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
  };

  const handleDelete = (id) => deleteProduct(id);

  return <div>{/* Form nhập và bảng hiển thị sản phẩm */}</div>;
};

export default AdminProductPage;
