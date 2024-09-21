// pages/AddProduct.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../Layout";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  // Function to upload images to imgbb
  const uploadImages = async (images) => {
    const uploadedImageUrls = [];

    for (let image of images) {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=d49ed4f9c6fad26f0dbf08cb306cefce`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success) {
        uploadedImageUrls.push(result.data.url);
      }
    }

    return uploadedImageUrls;
  };

  // Function to handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Upload images to imgbb
      const uploadedImageUrls = await uploadImages(data.images);

      // Prepare product data
      const productData = {
        name: data.name,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        offerPrice: data.offerPrice || null,
        images: uploadedImageUrls,
      };

      // Save product data to database
      const response = await fetch("https://local-grocery-back-end.vercel.app/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Product added successfully!");
        reset(); // Reset form fields
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="mt-1 py-3 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Product name is required.</p>
          )}
        </div>

        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
          defaultValue={""}
            {...register("category", { required: true })}
            className="mt-1 py-3 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          >
            <option value="" disabled selected>Select a category</option>
            <option value="Fruits & Vegetables">Fruits & Vegetables</option>
            <option value="Dairy & Eggs">Dairy & Eggs</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Bakery">Bakery</option>
            <option value="Frozen Foods">Frozen Foods</option>
            <option value="Meat & Seafood">Meat & Seafood</option>
            <option value="Pantry Staples">Pantry Staples</option>
            <option value="Health & Beauty">Health & Beauty</option>
            <option value="Household Items">Household Items</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">Category is required.</p>
          )}
        </div>


        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title", { required: true })}
            className="mt-1 py-3 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter product title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">title is required.</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="mt-1 py-3 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">Description is required.</p>
          )}
        </div>


        {/* Price */}
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            {...register("price", { required: true })}
            className="mt-1 py-3 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">Price is required.</p>
          )}
        </div>

        {/* Offer Price */}
        <div>
          <label className="block text-sm font-medium">Offer Price</label>
          <input
            {...register("offerPrice")}
            className="mt-1 py-3 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter offer price if available"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium">Product Images</label>
          <input
            type="file"
            {...register("images", { required: true })}
            className="mt-1 py-3 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            accept="image/*"
            multiple
          />
          {errors.images && (
            <p className="text-red-500 text-sm">
              At least one image is required.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-md focus:outline-none ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

AddProduct.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
