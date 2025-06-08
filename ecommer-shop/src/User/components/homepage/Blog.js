import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Blog = () => {
  // State cho tìm kiếm và danh mục đã chọn
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Dữ liệu các bài viết (giả sử bạn có một mảng các bài viết với danh mục)
  // const blogPosts = [
  //   {
  //     id: 1,
  //     title: "Revitalize Your Living Spaces: A Guide to Trends",
  //     date: "JAN 02, 2024",
  //     image: "../images/blog-1.jpg",
  //     description:
  //       "Discover how to transform your home into a stylish and functional space by following the top interior trends of 2024...",
  //     category: "Bathroom",
  //   },
  //   {
  //     id: 2,
  //     title: "Small Spaces, Big Style: Interior Ideas That Work",
  //     date: "FEB 10, 2024",
  //     image: "../images/blog-2.jpg",
  //     description:
  //       "Learn how to make the most of small spaces with smart furniture choices and design tips.",
  //     category: "Chair",
  //   },
  //   {
  //     id: 3,
  //     title: "How to Choose the Right Lighting for Every Room",
  //     date: "MAR 15, 2024",
  //     image: "../images/blog-3.jpg",
  //     description:
  //       "Explore the best lighting choices for different rooms to create the perfect ambiance.",
  //     category: "Decor",
  //   },
  // ];

  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-all-blog"
        );
        setBlogPosts(response.data); // Gán dữ liệu từ server
      } catch (error) {
        console.error("Lỗi khi fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Hàm lọc bài viết theo từ khóa tìm kiếm và danh mục
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearchTerm = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;
    return matchesSearchTerm && matchesCategory;
  });

  // Danh sách các danh mục
  const categories = ["Bathroom", "Chair", "Decor", "Lamp", "Table"];

  return (
    <div>
      <main>
        <section className="relative">
          <img src="./images/img_product_list_banner.webp" alt="" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-4xl font-semibold">Blogs</h2>
            <ul className="flex items-center gap-3 justify-center mt-2">
              <li className="">
                <Link to="/">Home / </Link>
              </li>
              <li className="">
                <Link to="#">Blogs</Link>
              </li>
            </ul>
          </div>
        </section>

        <div className="grid grid-cols-10 gap-4 px-4 py-8">
          <div className="col-span-3 p-4 text-left">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Categories */}
            <div>
              <h2 className="text-xl">Categories</h2>
              <ul>
                {/* Thêm một mục 'All' để hiển thị tất cả bài viết */}
                <li
                  className="text-midGray text-base cursor-pointer"
                  onClick={() => setSelectedCategory("")}
                >
                  <Link>All</Link>
                </li>
                {categories.map((category) => (
                  <li
                    key={category}
                    className="text-midGray text-base cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <Link>{category}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latest Posts */}
            <div>
              <h2 className="text-xl mt-3 mb-2">Latest Posts</h2>
              {filteredPosts.map((post) => (
                <div key={post.id} className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-5">
                    <img
                      className="w-full h-[150px] object-cover rounded-lg"
                      src={post.image}
                      alt="Blog Cover"
                    />
                  </div>
                  <div className="col-span-7">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-midGray">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* all bài viết */}
            <div>
              <h2 className="text-xl mt-3 mb-2">All Posts</h2>
              {blogPosts.map((post) => (
                <div key={post.id} className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-5">
                    <img
                      className="w-full h-[150px] object-cover rounded-lg"
                      src={post.image}
                      alt="Blog Cover"
                    />
                  </div>
                  <div className="col-span-7">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-midGray">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-7 p-4 text-left">
            {/* Render các bài viết đã lọc */}
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden mb-5"
              >
                <img
                  src={post.image}
                  alt="Blog Cover"
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <button className="mt-2 px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
