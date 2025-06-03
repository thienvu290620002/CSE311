import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

const AdminUserPage = ({ goBack }) => {
  const [users, setUsers] = useState([]);
  // const [filteredUsers, setFilteredUsers] = useState([]); // This state is currently unused in the provided code, but kept for potential future filtering
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "", // Only for new user creation
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    gender: "",
    image: "", // Placeholder, as image handling logic isn't fully in this snippet
    roleId: "",
  });

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(users.length / itemsPerPage); // Use `users.length` since `filteredUsers` is not actively used for filtering
  const currentItems = users.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const formRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/get-all-user"
      );
      const userList = Array.isArray(response.data)
        ? response.data
        : response.data.users || [];
      setUsers(userList);
      // setFilteredUsers(userList); // No active filtering in this component, so not setting this
      setCurrentPage(0); // Reset to first page on new data fetch
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error", "Failed to fetch user data.", "error"); // User-friendly error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      password: "", // Do not pre-fill password for security
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
      password: "",
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
    // Specific handling for phone number to ensure only digits and max length
    if (name === "phoneNumber") {
      let cleanedValue = value.replace(/\D/g, ""); // Remove non-digits
      if (cleanedValue.length > 10) {
        cleanedValue = cleanedValue.slice(0, 10); // Truncate to 10 digits
      }
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Check for duplicate email before sending
    const isDuplicate = users.some((user) => user.email === formData.email);
    if (isDuplicate) {
      Swal.fire("Error", "Email already exists in the system!", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/create-new-user",
        formData
      );
      const data = response.data;

      if (data.errCode !== 0) {
        Swal.fire("Error", data.errMessage || "Failed to add user.", "error");
        return;
      }

      fetchUsers();
      handleCancelEdit();
      Swal.fire("Success!", "User added successfully.", "success");
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire(
        "Error",
        error.response?.data?.errMessage || "Server error while adding user.",
        "error"
      );
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/update-user",
        {
          ...formData,
          id: userId, // Ensure user ID is sent for update
        }
      );

      if (response.data.errCode !== 0) {
        Swal.fire(
          "Error",
          response.data.errMessage || "Failed to update user.",
          "error"
        );
        return;
      }

      fetchUsers();
      handleCancelEdit();
      Swal.fire("Success!", "User updated successfully.", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error", "Failed to update user.", "error");
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
          await axios.get("http://localhost:8080/api/delete-user", {
            params: { id },
          });
          fetchUsers();
          // If the deleted user was the one being edited, clear the form
          if (id === userId) {
            handleCancelEdit();
          }
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire(
            "Error!",
            "Failed to delete user. Please try again.",
            "error"
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your user is safe!", "info");
      }
    });
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
          User Management
        </h1>
        {/* Users Table */}
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
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
                currentItems.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    {" "}
                    {/* Subtle hover effect */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <img
                        src={
                          user.roleId === "admin"
                            ? "/images/admin.jpg"
                            : user.image && user.image !== null
                              ? `http://localhost:8080/${user.image}`
                              : "/images/user.jpg"
                        }
                        alt="User"
                        className="w-12 h-12 object-cover rounded-full mx-auto ring-1 ring-gray-200" // Small ring for definition
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {`${user.firstName || ""} ${user.lastName || ""}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {user.phoneNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {user.address || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {user.gender || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.roleId === "admin"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.roleId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-3">
                        {" "}
                        {/* Increased gap */}
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
                    colSpan="8"
                    className="px-6 py-10 text-center text-gray-500 text-lg"
                  >
                    No users found.
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
        {/* User Form */}
        <div className="mt-12 pt-8 border-t border-gray-200" ref={formRef}>
          {" "}
          {/* Separator and top padding */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {userId ? "Edit User" : "Add New User"}
          </h2>
          <form
            onSubmit={userId ? handleUpdateUser : handleAddUser}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {" "}
              {/* Responsive grid */}
              {/* Email */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Email
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm ${userId ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={userId} // Disable email input when editing
                  required
                  placeholder="user@example.com"
                />
              </div>
              {/* Password (only for new users) */}
              {!userId && (
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    name="password"
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                    required
                    placeholder="••••••••"
                  />
                </div>
              )}
              {/* First Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="mb-2 font-semibold text-gray-700"
                >
                  First Name
                </label>
                <input
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  required
                  placeholder="John"
                />
              </div>
              {/* Last Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Last Name
                </label>
                <input
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  required
                  placeholder="Doe"
                />
              </div>
              {/* Address */}
              <div className="flex flex-col">
                <label
                  htmlFor="address"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Address
                </label>
                <input
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  required
                  placeholder="123 Main St, Anytown"
                />
              </div>
              {/* Phone Number */}
              <div className="flex flex-col">
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text" // Keep as text to allow formatting flexibility, but use inputMode for mobile keyboard
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="0123456789"
                />
              </div>
              {/* Gender */}
              <div className="flex flex-col">
                <label
                  htmlFor="gender"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>{" "}
                  {/* Added 'Other' for inclusivity */}
                </select>
              </div>
              {/* Role ID */}
              <div className="flex flex-col">
                <label
                  htmlFor="roleId"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Role
                </label>
                <select
                  name="roleId"
                  id="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">-- Select Role --</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-center space-x-4 pt-4">
              {" "}
              {/* Centered buttons with spacing */}
              <button
                type="submit"
                className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 ${
                  userId
                    ? "bg-green text-white hover:bg-green-700 focus:ring-green-500" // Green for update
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" // Blue for add
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {userId ? "Update User" : "Add User"}
              </button>
              {userId && (
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

export default AdminUserPage;
