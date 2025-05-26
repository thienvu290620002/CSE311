import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import ReactPaginate from "react-paginate";

const AdminUserPage = ({ goBack }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    gender: "",
    image: "",
    roleId: "",
  });

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  // const [users, setUsers] = useState([]);
  const currentItems = users.slice(
    currentPage * itemsPerPage,
<<<<<<< HEAD
    (currentPage + 1) * itemsPerPage
=======
    (currentPage + 1) * itemsPerPage,
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const formRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
<<<<<<< HEAD
        "http://localhost:8080/api/get-all-user"
=======
        "http://localhost:8080/api/get-all-user",
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
      );
      const userList = Array.isArray(response.data)
        ? response.data
        : response.data.users || [];
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      image: user.image || "",
      roleId: user.roleId,
    });
    setUserId(user.id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleCancelEdit = () => {
    setUserId(null);
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: "",
      gender: "",
      image: "",
      roleId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Kiểm tra trùng email trước khi gửi request
    const isDuplicate = users.some((user) => user.email === formData.email);
    if (isDuplicate) {
      swal("Error", "Email already exists in the system!", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/create-new-user",
<<<<<<< HEAD
        formData
=======
        formData,
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
      );
      const data = response.data;

      if (data.errCode !== 0) {
        swal("Error", data.errMessage || "Failed to add user", "error");
        return;
      }

      fetchUsers();
      handleCancelEdit();
      swal("Success!", "User added successfully.", "success");
    } catch (error) {
      console.error("Error adding user:", error);
      swal(
        "Error",
        error.response?.data?.errMessage || "Server error while adding user.",
<<<<<<< HEAD
        "error"
=======
        "error",
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
      );
    }
  };

  // const handleUpdateUser = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post("http://localhost:8080/api/update-user", {
  //       ...formData,
  //       id: userId,
  //     });
  //     fetchUsers();
  //     handleCancelEdit();
  //     swal("Success!", "User updated successfully.", "success");
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     swal("Error", "Failed to update user.", "error");
  //   }
  // };
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    console.log("Updating user with data:", formData); // In ra formData trước khi gửi
    try {
      const response = await axios.post(
        "http://localhost:8080/api/update-user",
        {
          ...formData,
          id: userId, // Đảm bảo rằng id người dùng được gửi lên
<<<<<<< HEAD
        }
=======
        },
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
      );
      console.log(response);

      fetchUsers();
      handleCancelEdit();
      swal("Success!", "User updated successfully.", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      swal("Error", "Failed to update user.", "error");
    }
  };

  const handleDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "This will permanently delete the user!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.get("http://localhost:8080/api/delete-user", {
            params: { id },
          });
          fetchUsers();
          if (id === userId) {
            handleCancelEdit();
          }
          swal("Deleted!", "User was successfully deleted.", {
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          swal("Error!", "Failed to delete user.", { icon: "error" });
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-8">
        User Management
      </h1>
      {/* <button
        onClick={goBack}
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back to Dashboard
      </button> */}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border mx-auto max-w-6xl">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              {[
                "Image",
                "Email",
                "Full Name",
                "Phone",
                "Address",
                "Gender",
                "Role",
                "Actions",
              ].map((h) => (
                <th key={h} className="border px-6 py-3 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border px-6 py-4 text-center">
                  <img
                    src={
                      user.roleId === "admin" // Nếu là admin, hiển thị ảnh khác
                        ? "./images/admin.jpg" // Đường dẫn đến ảnh admin
                        : user.image && user.image !== null
                          ? user.image // Nếu có ảnh, hiển thị ảnh của người dùng
                          : "./images/user.jpg" // Nếu không có ảnh, hiển thị ảnh mặc định
                    }
                    alt="User"
                    className="w-12 h-12 object-cover rounded-full mx-auto"
                  />
                </td>
                <td className="border px-6 py-4">{user.email}</td>
                <td className="border px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                <td className="border px-6 py-4 text-center">
                  {user.phoneNumber}
                </td>
                <td className="border px-6 py-4 text-center">{user.address}</td>
                <td className="border px-6 py-4 text-center">{user.gender}</td>
                <td className="border px-6 py-4 text-center">{user.roleId}</td>
                <td className="border px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
        pageClassName="px-4 py-2 border rounded-md text-sm hover:bg-blue-100"
        activeClassName="bg-blue-600 text-white"
        previousClassName="px-4 py-2 border rounded-md text-sm hover:bg-blue-100"
        nextClassName="px-4 py-2 border rounded-md text-sm hover:bg-blue-100"
      />
      <form
        onSubmit={userId ? handleUpdateUser : handleAddUser}
        ref={formRef}
        className="space-y-6 mb-12"
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-md"
              disabled={userId ? true : false} // Không cho phép chỉnh sửa email khi ở chế độ Edit
              required={!userId} // Set required only when adding a new user
            />
          </div>

          {/* Password */}
          {!userId && (
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded-md"
                required // Set required when adding a new user
              />
            </div>
          )}

          {/* First Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-md"
              required={!userId} // Set required only when adding a new user
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-md"
              required={!userId} // Set required only when adding a new user
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-md"
              required={!userId} // Set required only when adding a new user
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">Phone Number</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-md"
              required={!userId} // Set required only when adding a new user
            />
          </div>

          {/* Image URL */}
          {/* <div className="flex flex-col">
            <label className="mb-1 font-medium">Image URL</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-md"
            />
          </div> */}

          {/* Gender */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <label className="mb-1 font-medium text-left">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-md"
              required={!userId} // Set required only when adding a new user
            >
              <option value="">-- Select Gender --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              userId
                ? "bg-green text-white hover:bg-green-500"
                : "bg-black text-white hover:bg-gray-700"
            }`}
          >
            {userId ? "Update User" : "Add User"}
          </button>
          {userId && (
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
  );
};

export default AdminUserPage;
