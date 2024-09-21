"use client"; // If using Next.js for proper use of client components
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserSignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router  = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const CustomerData = JSON.parse(localStorage.getItem("customer"));
      setCustomer(CustomerData);
    }
  }, []);

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch("https://local-grocery-back-end.vercel.app/user-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Parse the JSON response
      const result = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("customer", JSON.stringify(result.customer));
        // Check for success
        router.reload()
        alert("User signed up successfully!");
      } else {
        // Handle errors
        alert(result.message || "An error occurred during sign-up.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred during sign-up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="mt-1 py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^[0-9]{11}$/,
                message: "Phone number must be 11 digits",
              },
            })}
            className="mt-1 py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
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

        {customer ? (
          <button
            className="w-full py-2 px-4 bg-blue-200 text-white rounded-md"
            disabled
          >
            AllReady SignUp
          </button>
        ) : (
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        )}
        <div>
          <p className="mt-3">
            AllReady have a accout?{" "}
            <Link
              href={"/components/UserLogin/login"}
              className="text-blue-500"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserSignUp;
