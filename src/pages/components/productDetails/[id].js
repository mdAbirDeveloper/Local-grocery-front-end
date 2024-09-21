/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import TruncateText from "../../../TruncateText";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

const ProductDetails = () => {
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const CustomerData = JSON.parse(localStorage.getItem("customer"));
      setCustomer(CustomerData);
    }
  }, []);

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  // Set the default main image when the product data is available
  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://local-grocery-back-end.vercel.app/products/${productId}`
        );
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async (productId) => {
    if (!customer) {
      console.log(customer);
      alert("Please log in to add items to your cart.");
      return;
    }

    const cartData = {
      customer_id: customer._id,
      product_id: productId,
    };

    try {
      const response = await fetch("https://local-grocery-back-end.vercel.app/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Product added to cart successfully!");
      } else {
        alert(result.message || "Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while adding the product to the cart.");
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found.</div>;
  }

  return (
    <div>
      <div className="p-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg flex flex-col lg:flex-row p-6 transition transform hover:scale-105 duration-300 ease-in-out">
          {/* Left Side - Product Images */}
          <div className="lg:w-1/2 w-full flex flex-col items-center lg:items-start">
            {/* Main Image */}
            <img
              src={mainImage}
              alt={product.name}
              className="h-64 w-64 object-cover rounded-lg mb-4 lg:mb-0"
            />
            {/* Thumbnail Images */}
            <div className="flex text-center mt-4">
              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index}`}
                  className="w-16 h-16 object-cover cursor-pointer border border-gray-300 rounded-lg ml-2"
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="lg:w-1/2 w-full mt-4 lg:mt-0 lg:pl-6">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">
              {product.name}
            </h1>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
              {product.title}
            </h2>
            <TruncateText text={product.description} maxLength={100} />
            <div className="grid grid-cols-2 mt-4">
              <div>
                <p className="text-lg font-bold mt-2">
                  Price: <span className="text-red-500">${product.price}</span>
                </p>
                {product.offerPrice && (
                  <p className="text-lg font-bold text-green-500 mt-3">
                    Offer Price: ${product.offerPrice}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product._id)}
                className="mt-4 flex items-center justify-center bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-300"
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
