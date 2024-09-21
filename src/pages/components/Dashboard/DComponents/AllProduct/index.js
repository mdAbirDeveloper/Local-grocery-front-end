import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../Layout';
import { useRouter } from 'next/router';

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://local-grocery-back-end.vercel.app/allProducts');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`https://local-grocery-back-end.vercel.app/deleteProducts/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts(products.filter((product) => product._id !== id));
          alert('Product deleted successfully.');
        } else {
          alert('Failed to delete product.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Navigate to update page
  const handleUpdate = (id) => {
    router.push(`/components/Dashboard/DComponents/AllProduct/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">All Products</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {/* For larger screens: show table */}
          <div className="hidden md:block">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Price</th>
                  <th className="py-2 px-4 border">Category</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.slice().reverse().map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="py-2 px-4 border">{product.name}</td>
                    <td className="py-2 px-4 border">{product.title}</td>
                    <td className="py-2 px-4 border">${product.price}</td>
                    <td className="py-2 px-4 border">{product.category}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleUpdate(product._id)}
                        className="mr-2 px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded mt-1 md:mt-0"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* For mobile screens: show product cards */}
          <div className="block md:hidden">
            {products?.slice().reverse().map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-lg mb-4 p-4">
                <h2 className="text-lg font-bold">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.title}</p>
                <p className="text-md font-semibold">Price: ${product.price}</p>
                <p className="text-sm text-gray-600">Category: {product.category}</p>
                <div className="mt-4 grid grid-cols-2">
                  <button
                    onClick={() => handleUpdate(product._id)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProduct;

AllProduct.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
