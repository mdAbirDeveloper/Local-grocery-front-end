/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import DashboardLayout from "./Layout";
import ReactModal from "react-modal";
import axios from "axios";
import Link from "next/link";

const DashBoard = () => {
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

  const calculateDueAmount = (user) => {
    const totalBuyAmount = user?.buyDetail?.reduce((acc, item) => {
      return acc + parseFloat(item.totalPrice || 0);
    }, 0);

    const totalPaidAmount = user.payDetail.reduce((acc, item) => {
      return acc + parseFloat(item.amount || 0);
    }, 0);

    return totalBuyAmount - totalPaidAmount;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      <p className="text-gray-600 mb-4">
        Use the search bar below to find users by their ID, phone number, or
        name.
      </p>
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by user ID, phone, or name"
          className="p-3 border border-gray-300 rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {loading && <p className="text-blue-500 mb-4">Searching...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div>
        {users.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.userId}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  User ID: {user.userId}
                </h3>
                <p className="text-gray-600 mb-1">
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Name:</strong> {user.name}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Due Amount:</strong>{" "}
                  {calculateDueAmount(user).toFixed(2)}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => openModal(user)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Add Money
                  </button>
                  <button
                    onClick={() => openPayMoneyModal(user)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
        ) : (
          <p className="text-gray-600 mt-4">
            No users found matching your criteria.
          </p>
        )}
      </div>

      {/* Add Money Modal */}
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

DashBoard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DashBoard;
