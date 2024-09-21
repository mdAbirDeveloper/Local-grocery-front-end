// components/Navbar.js
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const customerData = JSON.parse(localStorage.getItem("customer"));
      setCustomer(customerData);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    router.reload();
  };

  const handleCustomerSignOut = () => {
    localStorage.removeItem("customer");
    router.reload();
  };

  return (
    <nav className="bg-green-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold animate-pulse">
          Welcome {customer?.name || "Guest"}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
            Home
          </Link>

          <Link href="/components/offer" className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
            Offers
          </Link>

          <Link href="/components/cart" className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
            Cart
          </Link>

          <Link href="/components/order" className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
            Orders
          </Link>

          {customer ? (
            <button
              onClick={handleCustomerSignOut}
              className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign Out Customer
            </button>
          ) : (
            <Link href="/components/UserLogin/login" className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
              Customer Login
            </Link>
          )}

          {user?.email === "MDSAHJALAL9778@GMAIL.COM" && (
            <Link href="/components/Dashboard" className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
              DashBoard
            </Link>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/components/Login/login" className="text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none transition-transform duration-300 ease-in-out"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 transform rotate-45"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5m-16.5 4.5h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white text-gray-800 p-4 rounded-md shadow-md transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <Link
          href="/"
          className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/components/offer"
          className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Offers
        </Link>
        <Link
          href="/components/cart"
          className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Cart
        </Link>
        <Link
          href="/components/order"
          className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Order
        </Link>
        {customer ? (
          <button
            onClick={() => {
              handleCustomerSignOut();
              setIsMobileMenuOpen(false);
            }}
            className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Out Customer
          </button>
        ) : (
          <Link
            href="/components/UserLogin/login"
            className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Customer Login
          </Link>
        )}

        {user?.email === "MDSAHJALAL9778@GMAIL.COM" && (
          <Link
            href="/components/Dashboard"
            className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            DashBoard
          </Link>
        )}

        {user ? (
          <button
            onClick={() => {
              handleSignOut();
              setIsMobileMenuOpen(false);
            }}
            className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/components/Login/login"
            className="block py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
