// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import ReactPaginate from "react-paginate";
// import { v4 as uuidv4 } from "uuid";

// const AdminProductPage = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [productId, setProductId] = useState(null);
//   const [formData, setFormData] = useState({
//     productName: "",
//     productPrice: "",
//     productStatus: "",
//     quantity: "",
//     categoryType: "",
//     descriptions: "",
//     size: "",
//     image: "",
//   });
//   const [tempImages, setTempImages] = useState({
//     image: null,
//   });
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 5;
//   const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
//   const currentItems = filteredProducts.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );

//   const formRef = useRef(null);

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   const fetchProducts = () => {
//     fetch("http://localhost:8080/api/get-all-product")
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data);
//         setFilteredProducts(data);
//       })
//       .catch((error) => console.error("Error fetching products:", error));
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleEdit = (product) => {
//     setFormData({
//       productId: product.productId,
//       productName: product.productName,
//       productPrice: product.productPrice,
//       quantity: product.quantity,
//       image: product.image,
//       categoryType: product.categoryType,
//       descriptions: product.descriptions,
//       size: product.size,
//     });
//     setTempImages({
//       image: product.image
//         ? {
//             preview: `http://localhost:8080${product.image}`,
//           }
//         : null,
//     });
//     setProductId(product.id);
//     formRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleCancelEdit = () => {
//     setProductId(null);
//     setFormData({
//       productName: "",
//       productPrice: "",
//       productStatus: "",
//       quantity: "",
//       image: "",
//       categoryType: "",
//       descriptions: "",
//       size: "",
//     });
//     setTempImages({ image: null });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "productPrice") {
//       let rawValue = value.replace(/\D/g, "");
//       if (parseInt(rawValue) > 100000000) {
//         rawValue = "100000000";
//       }
//       setFormData((prev) => ({
//         ...prev,
//         [name]: rawValue,
//       }));
//     } else if (name === "quantity") {
//       let quantityValue = value.replace(/\D/g, "");

//       // Giới hạn tối đa là 999
//       if (parseInt(quantityValue) > 999) {
//         quantityValue = "999";
//       }

//       const status = parseInt(quantityValue) > 0 ? "onShop" : "outDate";
//       setFormData((prev) => ({
//         ...prev,
//         quantity: quantityValue,
//         productStatus: status,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleImageChange = (e, field) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const previewURL = URL.createObjectURL(file);
//     setTempImages((prev) => ({
//       ...prev,
//       [field]: {
//         file,
//         preview: previewURL,
//       },
//     }));
//   };

//   const uploadImageToServer = async (file) => {
//     try {
//       const imageFormData = new FormData();
//       imageFormData.append("image", file);
//       imageFormData.append("productName", formData.productName);

//       const response = await axios.post(
//         "http://localhost:8080/api/upload",
//         imageFormData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           validateStatus: (status) => status < 500,
//         }
//       );

//       if (response.status >= 400) {
//         throw new Error(response.data.error || "Upload failed");
//       }

//       return response.data.url;
//     } catch (error) {
//       console.error("Upload error:", error);
//       Swal.fire("Error", error.message, "error");
//       return null;
//     }
//   };

//   const generateCustomProductId = () => {
//     const shortUuid = uuidv4().split("-")[0];
//     const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
//     return `PROD-${date}-${shortUuid}`;
//   };

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedData = { ...formData };
//       updatedData.productId = generateCustomProductId();

//       updatedData.productStatus =
//         parseInt(updatedData.quantity) > 0 ? "onShop" : "outDate";

//       if (tempImages.image?.file) {
//         const url = await uploadImageToServer(tempImages.image.file);
//         updatedData.image = url;
//       }

//       await axios.post(
//         "http://localhost:8080/api/create-new-product",
//         updatedData
//       );

//       fetchProducts();
//       handleCancelEdit();
//       Swal.fire("Success!", "Product Created!", "success");
//     } catch (error) {
//       Swal.fire("Error", "Creation failed", "error");
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedData = { ...formData };

//       if (tempImages.image?.file) {
//         const url = await uploadImageToServer(tempImages.image.file);
//         updatedData.image = url;
//       }

//       await axios.post("http://localhost:8080/api/update-product", {
//         ...updatedData,
//         id: productId,
//       });

//       fetchProducts();
//       handleCancelEdit();
//       Swal.fire("Success!", "Product updated!", "success");
//     } catch (error) {
//       Swal.fire("Error", "Update failed", "error");
//     }
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This will permanently delete the product!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Delete",
//       cancelButtonText: "Cancel",
//       dangerMode: true,
//       reverseButtons: true,
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.get("http://localhost:8080/api/delete-product-by-id", {
//             params: { productId: id },
//           });
//           fetchProducts();
//           Swal.fire("Deleted!", "Product was successfully deleted.", "success");
//         } catch (error) {
//           console.error("Error deleting product:", error);
//           Swal.fire(
//             "Error!",
//             "Failed to delete product. Please try again.",
//             "error"
//           );
//         }
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         Swal.fire("Cancelled", "The product is still in the list.", "info");
//       }
//     });
//   };

//   const handleCategoryFilterChange = (e) => {
//     const selectedCategory = e.target.value;
//     setCategoryFilter(selectedCategory);
//     setFilteredProducts(
//       selectedCategory
//         ? products.filter((p) => p.categoryType === selectedCategory)
//         : products
//     );
//   };

//   return (
//     <div>
//       <div className="p-6 max-w-6xl mx-auto">
//         <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
//           Product Management
//         </h1>

//         <div className="mb-6 flex justify-start">
//           <p className="mt-2 mr-3"> Filter</p>
//           <select
//             onChange={handleCategoryFilterChange}
//             value={categoryFilter}
//             className="border px-4 py-2 rounded-md"
//           >
//             <option value="">All Categories</option>
//             <option value="chair">Chair</option>
//             <option value="lamp">Lamp</option>
//             <option value="decor">Decor</option>
//           </select>
//         </div>

//         <div className="overflow-x-auto bg-white shadow-md rounded-lg border mx-auto max-w-6xl">
//           <table className="min-w-full table-fixed border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200 text-gray-600">
//                 <th className="border px-6 py-3 text-center">Image</th>
//                 <th className="border px-6 py-3 text-center">Name</th>
//                 <th className="border px-6 py-3 text-center">Price</th>
//                 <th className="border px-6 py-3 text-center">Quantity</th>
//                 <th className="border px-6 py-3 text-center">Category</th>
//                 <th className="border px-6 py-3 text-center">Size</th>
//                 <th className="border px-6 py-3 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((product) => (
//                 <tr
//                   key={product.productId || product.id}
//                   className="hover:bg-gray-50"
//                 >
//                   <td className="border px-6 py-4 text-center">
//                     <img
//                       src={`http://localhost:8080${product.image}`}
//                       alt={product.productName}
//                       className="w-16 h-16 object-cover rounded-md mx-auto"
//                     />
//                   </td>
//                   <td className="border px-6 py-4">{product.productName}</td>
//                   <td className="border px-6 py-4 text-center">
//                     {product.productPrice.toLocaleString("vi-VN")}₫
//                   </td>
//                   <td className="border px-6 py-4 text-center">
//                     {product.quantity}
//                   </td>
//                   <td className="border px-6 py-4 text-center">
//                     {product.categoryType}
//                   </td>
//                   <td className="border px-6 py-4 text-center">
//                     {product.size}
//                   </td>
//                   <td className="border px-6 py-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <ReactPaginate
//           breakLabel="..."
//           nextLabel="Next >"
//           onPageChange={handlePageClick}
//           pageRangeDisplayed={3}
//           marginPagesDisplayed={2}
//           pageCount={pageCount}
//           previousLabel="< Prev"
//           containerClassName="flex justify-center mt-6 space-x-2"
//           pageClassName="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-blue-100"
//           activeClassName="bg-blue-600 text-white"
//           previousClassName="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-blue-100"
//           nextClassName="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-blue-100"
//         />

//         <form
//           onSubmit={productId ? handleUpdateProduct : handleAddProduct}
//           className="space-y-6 mb-12"
//           ref={formRef}
//         >
//           <div className="grid grid-cols-2 gap-6">
//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-left">Product Name</label>
//               <input
//                 name="productName"
//                 value={formData.productName}
//                 onChange={handleInputChange}
//                 required
//                 className="border px-4 py-2 rounded-md"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-left">
//                 Product Status
//               </label>
//               <input
//                 type="text"
//                 value={
//                   productId
//                     ? Number(formData.quantity) > 0
//                       ? "On Shop"
//                       : "Out Date"
//                     : ""
//                 }
//                 readOnly
//                 className="border px-4 py-2 rounded-md bg-gray-100 cursor-not-allowed text-center font-semibold"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-left">Price</label>
//               <input
//                 name="productPrice"
//                 value={new Intl.NumberFormat("vi-VN").format(
//                   formData.productPrice || 0
//                 )}
//                 onChange={handleInputChange}
//                 required
//                 className="border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-left">Quantity</label>
//               <input
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleInputChange}
//                 required
//                 className="border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-left">Main Image</label>
//               <input
//                 type="file"
//                 onChange={(e) => handleImageChange(e, "image")}
//                 className="border px-4 py-2 rounded-md"
//                 accept="image/*"
//               />
//               {tempImages.image?.preview && (
//                 <img
//                   src={tempImages.image.preview}
//                   alt="Preview"
//                   className="w-32 h-32 object-cover mt-2 rounded"
//                 />
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-left">Category</label>
//               <select
//                 name="categoryType"
//                 value={formData.categoryType}
//                 onChange={handleInputChange}
//                 className="border px-4 py-2 rounded-md"
//                 required
//               >
//                 <option value="">-- Select Category --</option>
//                 <option value="chair">Chair</option>
//                 <option value="lamp">Lamp</option>
//                 <option value="decor">Decor</option>
//               </select>
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-left">Size</label>
//               <select
//                 name="size"
//                 value={formData.size}
//                 onChange={handleInputChange}
//                 className="border px-4 py-2 rounded-md"
//                 required
//               >
//                 <option value="">-- Select Size --</option>
//                 <option value="S">S</option>
//                 <option value="M">M</option>
//                 <option value="L">L</option>
//               </select>
//             </div>

//             <div className="flex flex-col col-span-2">
//               <label className="mb-1 font-medium text-left">Descriptions</label>
//               <textarea
//                 name="descriptions"
//                 value={formData.descriptions}
//                 onChange={handleInputChange}
//                 rows={4}
//                 className="border px-4 py-2 rounded-md resize-none"
//                 required
//               />
//             </div>
//           </div>

//           <div className="text-center">
//             <button
//               type="submit"
//               className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
//                 productId ? "bg-green text-white" : "bg-black text-white"
//               }`}
//             >
//               {productId ? "Update Product" : "Add Product"}
//             </button>
//             {productId && (
//               <button
//                 type="button"
//                 onClick={handleCancelEdit}
//                 className="ml-3 bg-red-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminProductPage;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { v4 as uuidv4 } from "uuid";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productStatus: "",
    quantity: "",
    categoryType: "",
    descriptions: "",
    size: "",
    image: "",
  });
  const [tempImages, setTempImages] = useState({
    image: null,
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const formRef = useRef(null);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetchProducts = () => {
    fetch("http://localhost:8080/api/get-all-product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setCurrentPage(0); // Reset to first page on new data fetch
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setFormData({
      productId: product.productId, // Ensure productId is passed for updates
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: product.quantity,
      image: product.image,
      categoryType: product.categoryType,
      descriptions: product.descriptions,
      size: product.size,
    });
    setTempImages({
      image: product.image
        ? {
            preview: `http://localhost:8080${product.image}`,
          }
        : null,
    });
    setProductId(product.id); // Use product.id for backend identification
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setProductId(null);
    setFormData({
      productName: "",
      productPrice: "",
      productStatus: "",
      quantity: "",
      image: "",
      categoryType: "",
      descriptions: "",
      size: "",
    });
    setTempImages({ image: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "productPrice") {
      let rawValue = value.replace(/\D/g, "");
      if (parseInt(rawValue) > 100000000) {
        rawValue = "100000000";
      }
      setFormData((prev) => ({
        ...prev,
        [name]: rawValue,
      }));
    } else if (name === "quantity") {
      let quantityValue = value.replace(/\D/g, "");
      if (parseInt(quantityValue) > 999) {
        quantityValue = "999";
      }

      const status = parseInt(quantityValue) > 0 ? "onShop" : "outDate";
      setFormData((prev) => ({
        ...prev,
        quantity: quantityValue,
        productStatus: status, // Update status based on quantity
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setTempImages((prev) => ({
      ...prev,
      [field]: {
        file,
        preview: previewURL,
      },
    }));
  };

  const uploadImageToServer = async (file) => {
    try {
      const imageFormData = new FormData();
      imageFormData.append("image", file);
      imageFormData.append("productName", formData.productName); // Consider unique name for image if needed

      const response = await axios.post(
        "http://localhost:8080/api/upload",
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          validateStatus: (status) => status < 500, // Handle 4xx status codes
        }
      );

      if (response.status >= 400) {
        throw new Error(response.data.error || "Image upload failed");
      }

      return response.data.url;
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire("Error", error.message, "error");
      return null;
    }
  };

  const generateCustomProductId = () => {
    const shortUuid = uuidv4().split("-")[0];
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `PROD-${date}-${shortUuid}`;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      updatedData.productId = generateCustomProductId(); // Assign new ID
      updatedData.productStatus =
        parseInt(updatedData.quantity) > 0 ? "onShop" : "outDate";

      if (tempImages.image?.file) {
        const url = await uploadImageToServer(tempImages.image.file);
        updatedData.image = url;
      } else {
        // If adding a new product, image is required.
        // You might want to add a validation here.
        Swal.fire(
          "Error",
          "Product image is required for new products.",
          "error"
        );
        return;
      }

      await axios.post(
        "http://localhost:8080/api/create-new-product",
        updatedData
      );

      fetchProducts();
      handleCancelEdit();
      Swal.fire("Success!", "Product created successfully!", "success");
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire(
        "Error",
        "Failed to create product. Please try again.",
        "error"
      );
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };

      if (tempImages.image?.file) {
        const url = await uploadImageToServer(tempImages.image.file);
        updatedData.image = url;
      }

      // Ensure productStatus is correctly updated based on quantity
      updatedData.productStatus =
        parseInt(updatedData.quantity) > 0 ? "onShop" : "outDate";

      await axios.post("http://localhost:8080/api/update-product", {
        ...updatedData,
        id: productId, // Pass the correct ID for update
      });

      fetchProducts();
      handleCancelEdit();
      Swal.fire("Success!", "Product updated successfully!", "success");
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire(
        "Error",
        "Failed to update product. Please try again.",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Tailwind red-600
      cancelButtonColor: "#6b7280", // Tailwind gray-500
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.get("http://localhost:8080/api/delete-product-by-id", {
            params: { productId: id },
          });
          fetchProducts();
          Swal.fire("Deleted!", "The product has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire(
            "Error!",
            "Failed to delete product. Please try again.",
            "error"
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your product is safe!", "info");
      }
    });
  };

  const handleCategoryFilterChange = (e) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
    setFilteredProducts(
      selectedCategory
        ? products.filter((p) => p.categoryType === selectedCategory)
        : products
    );
    setCurrentPage(0); // Reset pagination when filter changes
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {" "}
      {/* Light background for the entire page */}
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {" "}
        {/* Main container with improved shadow and rounded corners */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
          {" "}
          {/* Stronger heading */}
          Product Management
        </h1>
        {/* Filter Section */}
        <div className="mb-8 flex items-center space-x-4">
          <label
            htmlFor="categoryFilter"
            className="text-lg font-medium text-gray-700"
          >
            Filter by Category:
          </label>
          <select
            id="categoryFilter"
            onChange={handleCategoryFilterChange}
            value={categoryFilter}
            className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="chair">Chair</option>
            <option value="lamp">Lamp</option>
            <option value="decor">Decor</option>
          </select>
        </div>
        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-200">
          {" "}
          {/* Subtle inner shadow and border for table container */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              {" "}
              {/* Lighter header background */}
              <tr>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {" "}
              {/* White body, lighter dividers */}
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <tr
                    key={product.productId || product.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    {" "}
                    {/* Subtle hover effect */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <img
                        src={`http://localhost:8080${product.image}`}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded-md mx-auto ring-1 ring-gray-200" // Small ring for definition
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {product.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {product.productPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "VND",
                      })}{" "}
                      {/* Format as VND */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {product.categoryType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {product.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-3">
                        {" "}
                        {/* Increased gap */}
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-500 text-lg"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< Previous"
          containerClassName="flex justify-center items-center mt-8 space-x-2"
          pageClassName="block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150"
          activeClassName="!bg-blue-600 !text-white !border-blue-600 shadow-md"
          previousClassName="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150"
          nextClassName="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
        {/* Product Form */}
        <div className="mt-12 pt-8 border-t border-gray-200" ref={formRef}>
          {" "}
          {/* Separator and top padding */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {productId ? "Edit Product" : "Add New Product"}
          </h2>
          <form
            onSubmit={productId ? handleUpdateProduct : handleAddProduct}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {" "}
              {/* Responsive grid */}
              <div className="flex flex-col">
                <label
                  htmlFor="productName"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  placeholder="Enter product name"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="productStatus"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Product Status
                </label>
                <input
                  type="text"
                  id="productStatus"
                  value={
                    productId
                      ? Number(formData.quantity) > 0
                        ? "On Shop"
                        : "Out of Stock" // More intuitive text
                      : "(Calculated by quantity)" // Clearer for new product
                  }
                  readOnly
                  className="border border-gray-300 px-4 py-3 rounded-lg bg-gray-100 cursor-not-allowed text-base text-gray-700 font-medium text-center shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="productPrice"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Price (VND)
                </label>
                <input
                  type="text"
                  name="productPrice"
                  id="productPrice"
                  value={new Intl.NumberFormat("vi-VN").format(
                    formData.productPrice || 0
                  )}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  placeholder="e.g., 100,000"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="quantity"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Quantity
                </label>
                <input
                  type="number" // Changed to number type for better input experience
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0" // Ensure non-negative
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  placeholder="e.g., 100"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="imageUpload"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Product Image
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  onChange={(e) => handleImageChange(e, "image")}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  accept="image/*"
                />
                {tempImages.image?.preview && (
                  <div className="mt-4 flex items-center space-x-4">
                    <img
                      src={tempImages.image.preview}
                      alt="Product Preview"
                      className="w-24 h-24 object-cover rounded-md border border-gray-200 shadow-sm"
                    />
                    <span className="text-gray-600 text-sm">Image preview</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="categoryType"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Category
                </label>
                <select
                  name="categoryType"
                  id="categoryType"
                  value={formData.categoryType}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">-- Select Category --</option>
                  <option value="chair">Chair</option>
                  <option value="lamp">Lamp</option>
                  <option value="decor">Decor</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="size"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Size
                </label>
                <select
                  name="size"
                  id="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">-- Select Size --</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </div>
              <div className="flex flex-col col-span-1 md:col-span-2">
                {" "}
                {/* Full width on smaller screens, spans 2 columns on medium+ */}
                <label
                  htmlFor="descriptions"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Descriptions
                </label>
                <textarea
                  name="descriptions"
                  id="descriptions"
                  value={formData.descriptions}
                  onChange={handleInputChange}
                  rows={5} // Slightly increased rows for better visibility
                  className="border border-gray-300 px-4 py-3 rounded-lg resize-y text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  placeholder="Enter product descriptions..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              {" "}
              {/* Centered buttons with spacing */}
              <button
                type="submit"
                className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 ${
                  productId
                    ? "bg-green text-white hover:bg-green-700 focus:ring-green-500" // Green for update
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" // Blue for add
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {productId ? "Update Product" : "Add Product"}
              </button>
              {productId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-8 py-3 rounded-lg font-bold text-lg bg-red-500 text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductPage;
