/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [customer, setCustomer] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    address: "",
    phone: "",
  });

  // Fetch customer data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const CustomerData = JSON.parse(localStorage.getItem("customer"));
      setCustomer(CustomerData);
    }
  }, []);

  // Fetch cart products for the logged-in customer
  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!customer) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://local-grocery-back-end.vercel.app/cart?customer_id=${customer._id}`
        );
        const data = await response.json();
        // Initialize quantity for each product
        const productsWithQuantity = data.products.map((product) => ({
          ...product,
          quantity: 1,
        }));
        setCartProducts(productsWithQuantity);
        calculateTotal(productsWithQuantity); // Calculate total when products are fetched
      } catch (error) {
        console.error("Error fetching cart products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [customer]);

  // Calculate the total price of the cart items
  const calculateTotal = (products) => {
    const totalAmount = products.reduce((acc, product) => {
      // Calculate price based on quantity
      const price = product.offerPrice
        ? Number(product.offerPrice)
        : Number(product.price);
      return acc + price * product.quantity;
    }, 0);
    setTotal(totalAmount);
  };

  // Handle deleting a product from the cart
  const handleDeleteFromCart = async (productId) => {
    try {
      const response = await fetch(`https://local-grocery-back-end.vercel.app/remove-from-cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer._id,
          product_id: productId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Remove the product from the state and recalculate total
        const updatedProducts = cartProducts.filter(
          (product) => product._id !== productId
        );
        setCartProducts(updatedProducts);
        calculateTotal(updatedProducts);
      } else {
        console.error(result.message || "Failed to remove product from cart.");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  // Handle increasing quantity
  const handleIncreaseQuantity = (productId) => {
    const updatedProducts = cartProducts.map((product) =>
      product._id === productId
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    setCartProducts(updatedProducts);
    calculateTotal(updatedProducts);
  };

  // Handle decreasing quantity
  const handleDecreaseQuantity = (productId) => {
    const updatedProducts = cartProducts.map((product) =>
      product._id === productId && product.quantity > 1
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );
    setCartProducts(updatedProducts);
    calculateTotal(updatedProducts);
  };

  // Handle input change for checkout details
  const handleInputChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Handle checkout submission
  const handleCheckout = async (e) => {
    setCheckoutLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(`https://local-grocery-back-end.vercel.app/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer._id,
          products: cartProducts,
          total,
          address: orderDetails.address,
          phone: orderDetails.phone,
          paymentMethod: "COD", // Cash on Delivery
        }),
      });

      const result = await response.json();
      if (result.success) {
        setCheckoutLoading(false);
        alert("Order placed successfully with Cash on Delivery!");
        // Optionally, you can redirect to an order confirmation page here
      } else {
        setCheckoutLoading(false);
        console.error(result.message || "Checkout failed.");
      }
    } catch (error) {
      setCheckoutLoading(false);
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
        </div>
      ) : cartProducts?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cartProducts?.map((product) => (
              <div
                key={product._id}
                className="border bg-slate-100 p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <div>
                  <Link href={`/components/productDetails/${product._id}`}>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-sm text-gray-600">{product.title}</p>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    Price: $
                    {product.offerPrice
                      ? Number(product.offerPrice * product.quantity).toFixed(2)
                      : Number(product.price * product.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDecreaseQuantity(product._id)}
                      className="bg-gray-200 px-2 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-3">{product.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(product._id)}
                      className="bg-gray-200 px-2 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFromCart(product._id)}
                  className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-300 w-full"
                >
                  Delete from Cart
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold  bg-slate-100 w-44 text-center rounded">
              Total: ${total.toFixed(2)}
            </h2>

            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={orderDetails.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={orderDetails.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300 w-full"
                >
                  {checkoutLoading
                    ? "Order submitting..."
                    : "Place Order (Cash on Delivery)"}
                </button>
              </form>
            )}
          </div>
        </>
      ) : (
        <p>No products in your cart.</p>
      )}
    </div>
  );
};

export default Cart;
