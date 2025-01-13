import React, { useState, useEffect } from "react";
import axios from "axios";
import PopularProductCard from "../components/PopularProductCard";

const PurchaseProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state (initialize to null)

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    alert(`Purchase confirmed for ${selectedProduct.name}`);
    closeModal();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get("/api/v1/shoes"); // Replace with your actual API URL
        setProducts(response.data.data); // Update the products state with fetched data
        setIsLoading(false); // Set loading to false once the data is fetched
      } catch (error) {
        setError("Error fetching products"); // Set an error message if something goes wrong
        setIsLoading(false); // Also stop loading
      }
    };

    fetchProducts(); // Fetch products on page load
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  const handleDeleteProduct = (indexToDelete) => {
    const updatedProducts = products.filter((_, index) => index !== indexToDelete);
    setProducts(updatedProducts); // Assuming `setProducts` updates the state
  };
  

  return (
    <section className="xl:padding-l wide:padding-r padding-b scroll-mt-11">
      <div className="pt-28">
        <h1 className="text-3xl font-bold mb-6 text-red-500">
          Purchase Products
        </h1>

        {isLoading ? (
          <div className="text-center text-lg text-gray-500">Loading...</div> // Show loading text or spinner
        ) : error ? (
          <div className="text-center text-lg text-red-500">{error}</div> // Show error message
        ) : (
          <div className="mt-16 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 sm:gap-4 gap-14 mr-11">
            {products.map((item, index) => (
              <div key={index}>
                <PopularProductCard
                  imgURL={item.image}
                  name={item.name}
                  price={item.price}
                />
                <button
                  onClick={() => openModal(item)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Show
                </button>
                <button
                  onClick={() => handleDeleteProduct(index)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl transform transition-all scale-100">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Purchase Product
            </h2>
            <div className="flex justify-center mb-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="rounded-lg shadow-md w-40 h-40 object-cover"
              />
            </div>
            <form onSubmit={handlePurchase}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-red-300 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="number"
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-red-300 focus:outline-none"
                  placeholder="Enter size (e.g., 8)"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-red-300 focus:outline-none"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </label>
                <textarea
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-red-300 focus:outline-none"
                  rows="3"
                  placeholder="Enter your address"
                ></textarea>
              </div>
              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:ring focus:ring-red-300 focus:outline-none transition-all"
                >
                  Confirm Purchase
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:ring focus:ring-gray-300 focus:outline-none transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PurchaseProducts;
