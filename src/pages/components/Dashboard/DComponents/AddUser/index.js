import React, { useState } from "react";
import DashboardLayout from "../../Layout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Clear previous messages
    setError("");
    setSuccess("");

    // Validate inputs
    if (!name || !phone || !password) {
      setLoading(false);
      setError("All fields are required.");
      return;
    }

    try {
      // Send sign-up request to the server
      const response = await fetch("https://local-grocery-back-end.vercel.app/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, password }),
      });

      const data = await response.json();

      if (data.success) {
        setLoading(false);
        setSuccess(data.message);
        // Clear form fields
        setName("");
        setPhone("");
        setPassword("");
      } else {
        setLoading(false);
        setError(data.message || "Failed to Add User. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error signing up:", error);
      setError("An error occurred while signing up. Please try again later.");
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-6 border rounded-lg shadow-2xl mt-5">
        <h2 className="text-2xl font-semibold text-center mb-4">Add User</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-3 border rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-white"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 p-3 border rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
              pattern="01\d{9}"
              title="Phone number must be 11 digits long and start with 01."
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-3 border rounded-lg w-full shadow-md pr-12 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center mt-7"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            {loading ? "Adding user..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

// Setting layout for the component
SignUp.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
