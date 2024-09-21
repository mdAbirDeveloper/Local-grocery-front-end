// components/Login.js
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  // Function to handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("https://local-grocery-back-end.vercel.app/admin-login", {
        // Replace with your backend API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        alert("Login successful!");
        router.reload()
      } else {
        alert(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {/* Email or Phone Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Email or Phone</label>
          <input
            type="text"
            {...register("identifier", {
              required: "Email or phone number is required",
            })}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email or phone"
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm">{errors.identifier.message}</p>
          )}
        </div>

         {/* Password Field */}
         <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle show/hide state
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        {user ? (
          <button
            className="w-full py-2 mt-2 text-white opacity-30 rounded-md bg-blue-500 hover:bg-blue-600"
            disabled
          >
            AllReady Login
          </button>
        ) : (
          <button
            type="submit"
            className={`w-full py-2 mt-2 text-white rounded-md ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } transition-colors`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
