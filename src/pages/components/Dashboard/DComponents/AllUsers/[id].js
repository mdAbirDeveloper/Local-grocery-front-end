"use client"; // Ensure it's client-side for Next.js 13 App Router

import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout";

const UserDetails = () => {
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleClearPaidDetails = async () => {
    // Ask for confirmation
    const userConfirmed = window.confirm(
      "Are you sure you want to clear paid details?"
    );

    if (!userConfirmed) {
      return; // Exit the function if the user cancels
    }

    try {
      const response = await fetch(`https://local-grocery-back-end.vercel.app/clearPaidDetails`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response) {
        const result = await response.json();
        router.reload();
      } else {
        console.error("Error clearing paid details:", response.statusText);
        alert("Failed to clear paid details.");
      }
    } catch (error) {
      console.error("Error clearing paid details:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleClearBuyDetails = async () => {
    // Ask for confirmation
    const userConfirmed = window.confirm(
      "Are you sure you want to clear Buy details?"
    );

    if (!userConfirmed) {
      return; // Exit the function if the user cancels
    }

    try {
      const response = await fetch(`https://local-grocery-back-end.vercel.app/clearBuyDetails`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response) {
        const result = await response.json();
        router.reload();
      } else {
        console.error("Error clearing Buy details:", response.statusText);
        alert("Failed to clear Buy details.");
      }
    } catch (error) {
      console.error("Error clearing Buy details:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Fetch user data based on ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://local-grocery-back-end.vercel.app/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) return <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
        </div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {user && (
        <>
          {/* Paid Details Table */}
          <h2 className="mt-8 text-center text-2xl font-serif font-bold text-green-500">
            Paid Details
          </h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {user.payDetail && user.payDetail.length > 0 ? (
                user.payDetail
                  .slice()
                  .reverse()
                  .map((detail, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border">
                        {parseFloat(detail.amount).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(detail.date).toLocaleDateString("en-GB")}{" "}
                        {/* For DD/MM/YYYY format */}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    No Paid Details Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="text-center text-white">
            <button
              className="bg-red-500 py-2 px-4 rounded mt-2"
              onClick={handleClearPaidDetails}
            >
              Clear Paid Details
            </button>
          </div>

          {/* Due Details Table */}
          <h2 className="mt-8 text-center text-2xl font-serif font-bold text-red-500">
            Due Details
          </h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border">Product Details</th>
                <th className="py-2 px-4 border">Total Price</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {user.buyDetail && user.buyDetail.length > 0 ? (
                user.buyDetail
                  .slice()
                  .reverse()
                  .map((detail, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border">
                        {detail.productDetails}
                      </td>
                      <td className="py-2 px-4 border">
                        {parseFloat(detail.totalPrice).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(detail.date).toLocaleDateString("en-GB")}{" "}
                        {/* For DD/MM/YYYY format */}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    No Due Details Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
      <div className="text-center text-white">
        <button
          className="bg-red-500 py-2 px-4 rounded mt-2"
          onClick={handleClearBuyDetails}
        >
          Clear Paid Details
        </button>
      </div>
    </div>
  );
};

export default UserDetails;

UserDetails.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
