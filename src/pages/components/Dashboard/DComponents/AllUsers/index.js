/* eslint-disable react-hooks/exhaustive-deps */
// components/AllUser.js
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout";
import ReactModal from "react-modal";
import axios from "axios";
import Link from "next/link";

const AllUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPayIsOpen, setModalPayIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    productDetails: "",
    totalPrice: 0,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://local-grocery-back-end.vercel.app/search-users?query=${searchTerm}`
      );
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError("No users found.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({ productDetails: "", totalPrice: 0 });
    setFormError("");
    setFormSuccess("");
  };

  const openPayMoneyModal = (user) => {
    setSelectedUser(user);
    setModalPayIsOpen(true);
    setFormData({ totalPrice: 0 });
    setError(null);
    setSuccess(null);
  };

  const closePayModal = () => {
    setModalPayIsOpen(false);
    setFormData({ totalPrice: 0 });
    setFormError("");
    setFormSuccess("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      const response = await axios.post(
        "https://local-grocery-back-end.vercel.app/update-user-money",
        {
          userId: selectedUser.userId,
          ...formData,
        }
      );
      const data = response.data;

      if (data.success) {
        setFormSuccess("Money details updated successfully!");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === selectedUser.userId
              ? {
                  ...user,
                  buyDetail: [
                    ...(user?.buyDetail || []),
                    {
                      productDetails: formData.productDetails,
                      totalPrice: parseFloat(formData.totalPrice),
                    },
                  ],
                }
              : user
          )
        );
        closeModal();
      } else {
        setFormError("Failed to update user details.");
      }
    } catch (error) {
      console.error("Error updating user money:", error);
      setFormError("Error updating user details. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handlePayMoneySubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const response = await fetch("https://local-grocery-back-end.vercel.app/pay-user-money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.userId,
          amount: formData.totalPrice,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormSuccess("Payment recorded successfully.");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === selectedUser.userId
              ? {
                  ...user,
                  payDetail: [
                    ...user.payDetail,
                    {
                      amount: formData.totalPrice,
                      date: new Date().toISOString(),
                    },
                  ],
                }
              : user
          )
        );
        closePayModal();
      } else {
        setFormError(data.message || "Failed to record payment.");
      }
    } catch (err) {
      setFormError("An error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://local-grocery-back-end.vercel.app/users");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`https://local-grocery-back-end.vercel.app/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        alert(result.message || "Failed to delete the user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  const calculateDueAmount = (user) => {
    // Set default values for buyDetail and payDetail arrays to avoid undefined errors
    const totalBuyAmount = (user?.buyDetail || []).reduce((acc, item) => {
      // Ensure totalPrice is parsed as a number, fallback to 0 if not available
      return acc + parseFloat(item.totalPrice || 0);
    }, 0);

    const totalPaidAmount = (user?.payDetail || []).reduce((acc, item) => {
      // Ensure amount is parsed as a number, fallback to 0 if not available
      return acc + parseFloat(item.amount || 0);
    }, 0);

    // Return the difference, ensuring it's a valid number; fallback to 0 if NaN
    return totalBuyAmount - totalPaidAmount || 0;
  };


  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">All Users</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
        </div>
        ) : (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 p-4">
            {users
              .sort((a, b) => calculateDueAmount(b) - calculateDueAmount(a)) // Sort by due amount in descending order
              .map((user) => (
                <div
                  key={user._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-full sm:w-80"
                >
                  <div className="flex flex-col space-y-2">
                    <div>
                      <strong className="text-gray-700">Name:</strong>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Phone:</strong>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">User ID:</strong>
                      <p className="text-gray-900">{user.userId}</p>
                    </div>
                    <div>
                      <strong className="text-green-500 font-serif font-bold">
                        Due Amount:
                      </strong>
                      <p className="text-green-500  font-bold">
                        {calculateDueAmount(user).toFixed() || 0} টাকা
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-2 py-3 rounded mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openModal(user)}
                      className="bg-green-500 text-white px-2 py-3 rounded hover:bg-green-600 mr-2"
                    >
                      Add Money
                    </button>
                    <button
                      onClick={() => openPayMoneyModal(user)}
                      className="bg-blue-500 text-white px-2 py-3 rounded hover:bg-blue-600"
                    >
                      Pay Money
                    </button>
                  </div>
                  <div>
                    <Link
                      href={`/components/Dashboard/DComponents/AllUsers/${user?._id}`}
                    >
                      <button className="w-full py-3 bg-green-500 text-white mt-2 rounded-md">
                        Show Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-5"
      >
        <h2 className="text-xl font-semibold mb-4">Add Money</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="productDetails"
              className="block text-sm font-medium text-gray-700"
            >
              Product Details
            </label>
            <input
              type="text"
              id="productDetails"
              name="productDetails"
              value={formData.productDetails}
              onChange={handleFormChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="totalPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleFormChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={formLoading}
          >
            {formLoading ? "Processing..." : "Submit"}
          </button>
        </form>
      </ReactModal>

      {/* Pay Money Modal */}
      <ReactModal
        isOpen={modalPayIsOpen}
        onRequestClose={closePayModal}
        className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-5"
      >
        <h2 className="text-xl font-semibold mb-4">Pay Money</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
        <form onSubmit={handlePayMoneySubmit}>
          <div className="mb-4">
            <label
              htmlFor="totalPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleFormChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={formLoading}
          >
            {formLoading ? "Processing..." : "Pay"}
          </button>
        </form>
      </ReactModal>
    </div>
  );
};

export default AllUser;

// Setting layout for the component
AllUser.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
