import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../Layout';

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders for the admin
  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://local-grocery-back-end.vercel.app/admin/orders`);
        const data = await response.json();
        setOrders(data.orders || []); // Assuming data.orders contains the orders array
      } catch (error) {
        console.error('Error fetching all orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (!confirmed) return;

    try {
      const response = await fetch(`https://local-grocery-back-end.vercel.app/admin/orders/${orderId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        alert('Order deleted successfully!');
        // Remove the deleted order from the state
        setOrders(orders.filter((order) => order._id !== orderId));
      } else {
        console.error(result.message || 'Failed to delete order.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">All Orders</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border-t-4 border-indigo-500 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold text-indigo-700">Order ID: {order._id}</h2>
                <p className="text-gray-600 mt-2">
                  Order Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mt-1">
                  Status: <span className="font-bold">{order.status}</span>
                </p>
                <p className="text-gray-900 font-semibold mt-3">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
              <div className="bg-indigo-50 p-4">
                <h3 className="text-md font-semibold text-indigo-600">Products:</h3>
                {order.products.map((product) => (
                  <div key={product.product_id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="text-gray-700">{product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                    </div>
                    <p className="text-gray-900 font-semibold">${product.price}</p>
                  </div>
                ))}
              </div>
              {/* Delete Order Button */}
              <div className="p-4">
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-300"
                >
                  Delete Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl font-medium text-gray-500">No orders found.</p>
        </div>
      )}
    </div>
  );
};

export default AllOrder;


AllOrder.getLayout = function getLayout(page) {
    return <DashboardLayout>{page}</DashboardLayout>
}
