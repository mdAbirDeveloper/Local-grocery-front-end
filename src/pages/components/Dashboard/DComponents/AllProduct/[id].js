// components/UpdateProduct/[id].js
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import DashboardLayout from "../../Layout";

const UpdateProduct = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // Fetch product details to update
      const fetchProduct = async () => {
        try {
          const response = await fetch(`https://local-grocery-back-end.vercel.app/products/${id}`);
          const data = await response.json();
          setProduct(data);
          setValue("name", data.name);
          setValue("title", data.title);
          setValue("description", data.description);
          setValue("price", data.price);
          setValue("offerPrice", data.offerPrice);
          setValue("category", data.category);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };

      fetchProduct();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`https://local-grocery-back-end.vercel.app/updateProducts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json();
  
      if (response.ok && responseData.success) {
        alert(responseData.message || "Product updated successfully.");
      } else {
        alert(responseData.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  if (!product) return <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
        </div>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <h1 className="text-xl font-semibold mb-4">Update Product</h1>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="mt-1 py-2 px-3 block w-full border rounded-md"
            placeholder="Product Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="mt-1 py-2 px-3 block w-full border rounded-md"
            placeholder="Product Title"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required.</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="mt-1 py-2 px-3 block w-full border rounded-md"
            placeholder="Product Description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">Description is required.</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            {...register("price", { required: true })}
            className="mt-1 py-2 px-3 block w-full border rounded-md"
            placeholder="Product Price"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">Price is required.</p>
          )}
        </div>

        {/* Offer Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Offer Price</label>
          <input
            type="number"
            {...register("offerPrice")}
            className="mt-1 py-2 px-3 block w-full border rounded-md"
            placeholder="Offer Price"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <select
            {...register("category", { required: true })}
            className="mt-1 py-2 px-3 block w-full border rounded-md"
          >
            <option value="">Select a category</option>
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

        <button
          type="submit"
          className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;

UpdateProduct.getLayout = function getLayout(page) {
    return <DashboardLayout>{page}</DashboardLayout>
}
