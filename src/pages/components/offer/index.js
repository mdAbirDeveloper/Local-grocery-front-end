/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

const Offer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const CustomerData = JSON.parse(localStorage.getItem("customer"));
      setCustomer(CustomerData);
    }
  }, []);

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

  useEffect(() => {
    const fetchOfferProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://local-grocery-back-end.vercel.app/products-with-offer"
        ); // Fetch only products with an offer price
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching offer products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferProducts();
  }, []);

  return (
    <div className="offer-page">
      <h1 className="text-2xl font-bold my-4">Products with Offers</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-item bg-slate-100 border p-4 mb-2 rounded shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div>
                <Link href={`/components/productDetails/${product._id}`}>
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-600">{product.title}</p>
                </Link>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex justify-between mt-2">
                  <div className="mt-2">
                    <p className="font-medium line-through">
                      Price: ${product.price}
                    </p>
                    <p className="text-red-500 font-medium">
                      Offer Price: ${product.offerPrice}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="mt-4 flex items-center justify-center bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-300"
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products with offers found.</p>
      )}
    </div>
  );
};

export default Offer;
