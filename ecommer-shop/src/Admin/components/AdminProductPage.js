import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import ReactPaginate from "react-paginate";
const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    quantity: "",
    image: "",
    categoryType: "",
    descriptions: "",
  });
  const [categoryFilter, setCategoryFilter] = useState(""); // state for category filter

  //Seperate page
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formRef = useRef(null);

  const fetchProducts = () => {
    fetch("http://localhost:8080/api/get-all-product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); // Set the filteredProducts to all products initially
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setFormData({
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: product.quantity,
      image: product.image,
      categoryType: product.categoryType,
      descriptions: product.descriptions,
      size: product.size,
    });
    setProductId(product.id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setProductId(null);
    setFormData({
      productName: "",
      productPrice: "",
      quantity: "",
      image: "",
      categoryType: "",
      descriptions: "",
      size: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "productPrice") {
      const rawValue = value.replace(/\D/g, ""); // Xoá tất cả ký tự không phải số
      const formatted = new Intl.NumberFormat("vi-VN").format(rawValue);

      setFormData((prev) => ({
        ...prev,
        [name]: rawValue, // Lưu giá trị raw (dạng số) để gửi backend
        formattedPrice: formatted, // Thêm field hiển thị nếu cần
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const newProduct = {
      ...formData,
      productId: Date.now(),
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(
        "http://localhost:8080/api/create-new-product",
        newProduct
      );

      setProducts((prev) => [...prev, newProduct]);
      setFormData({
        productName: "",
        productPrice: "",
        quantity: "",
        image: "",
        categoryType: "",
        descriptions: "",
        size: "",
      });

      fetchProducts();

      // ✅ Success notification
      swal("Success!", "Product has been added successfully.", "success");
    } catch (error) {
      console.error("Error adding product:", error);
      // ❌ Error notification
      swal("Error", "Failed to add product. Please try again.", "error");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (productId) {
      try {
        await axios.post("http://localhost:8080/api/update-product", {
          ...formData,
          id: productId,
        });
        fetchProducts();
        setProductId(null);
        setFormData({
          productName: "",
          productPrice: "",
          quantity: "",
          image: "",
          categoryType: "",
          descriptions: "",
          size: "",
        });
        // ✅ Success notification
        swal("Success!", "Product has been updatedd successfully.", "success");
      } catch (error) {
        console.error("Error update product:", error);
        // ❌ Error notification
        swal("Error", "Failed to update product. Please try again.", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "This will permanently delete the product!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.get("http://localhost:8080/api/delete-product-by-id", {
            params: { productId: id },
          });
          fetchProducts();
          swal("Deleted!", "Product was successfully deleted.", {
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting product:", error);
          swal("Error!", "Failed to delete product. Please try again.", {
            icon: "error",
          });
        }
      } else {
        swal("Cancelled", "The product is still in the list.");
      }
    });
  };

  // Filter products based on selected category
  const handleCategoryFilterChange = (e) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
    if (selectedCategory === "") {
      setFilteredProducts(products); // If no category selected, show all products
    } else {
      setFilteredProducts(
        products.filter((product) => product.categoryType === selectedCategory)
      );
    }
  };

  return (
    <div>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Product Management
        </h1>

        {/* Category filter */}

        <div className="mb-6 flex justify-start">
          <p className="mt-2 mr-3"> Filter</p>

          <select
            onChange={handleCategoryFilterChange}
            value={categoryFilter}
            className="border px-4 py-2 rounded-md"
          >
            <option value="">All Categories</option>
            <option value="chair">Chair</option>
            <option value="lamp">Lamp</option>
            <option value="decor">Decor</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg border  mx-auto max-w-6xl">
          <table className="min-w-full table-fixed border border-gray-300 border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Image
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Name
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Price
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Quantity
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Category
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Size
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => (
                <tr
                  key={product.productId || product.id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    {product.productName}
                  </td>
                  <td className="border border-gray-300 px-6 py-4  text-center">
                    {product.productPrice.toLocaleString("en-US")}₫
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    {product.quantity}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    {product.categoryType}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    {product.size}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< Prev"
          containerClassName="flex justify-center mt-6 space-x-2"
          pageClassName="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-blue-100"
          activeClassName="bg-blue-600 text-white"
          previousClassName="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-blue-100"
          nextClassName="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-blue-100"
        />
        <form
          onSubmit={productId ? handleUpdateProduct : handleAddProduct}
          className="space-y-6 mb-12"
          ref={formRef}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">Product Name</label>
              <input
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
                className="border px-4 py-2 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">Price</label>
              <input
                name="productPrice"
                value={new Intl.NumberFormat("vi-VN").format(
                  formData.productPrice || 0
                )}
                onChange={handleInputChange}
                placeholder="Enter price"
                required
                className="border px-4 py-2 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">Quantity</label>
              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                className="border px-4 py-2 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                className="border px-4 py-2 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">Category</label>
              <select
                name="categoryType"
                value={formData.categoryType}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded-md"
                required
              >
                <option value="">-- Select Category --</option>
                <option value="chair">Chair</option>
                <option value="lamp">Lamp</option>
                <option value="decor">Decor</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded-md"
                required
              >
                <option value="">-- Select size --</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">Descriptions</label>
              <textarea
                name="descriptions"
                value={formData.descriptions}
                onChange={handleInputChange}
                placeholder="Enter product descriptions"
                rows={4}
                className="border px-4 py-2 rounded-md resize-none"
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                productId
                  ? "bg-green text-white hover:bg-green-500"
                  : "bg-black text-white hover:bg-gray-700"
              }`}
            >
              {productId ? "Update Product" : "Add Product"}
            </button>
            {productId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="ml-3 bg-red-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductPage;
