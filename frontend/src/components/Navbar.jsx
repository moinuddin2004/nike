import React from "react";
import { headerLogo } from "../assets/images";
import { hamburger } from "../assets/icons";
import { navLinks } from "../constants";
import { Link } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
function Navbar() {
  const { register, handleSubmit, reset } = useForm();
  const [user, setUser] = useState({
    id: null,
    fullName: "",
    email: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/v1/users/current-user");
        // console.log(userData.data.data);
        const userData = response.data.data;
        setUser(userData); //
      } catch (error) {
        console.log(error.message);
      } finally {
        () => {
          setLoading(false);
        };
      }
    })();
  }, []);
  useEffect(() => {
    console.log(user);
  }, [user]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const onSubmit = async (data) => {
    // Create a new FormData instance
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("image", data.image[0]); // Add the image file

  try {
    let res = await axios.post("/api/v1/shoes", formData);
    console.log(res.data.data);

  } catch (error) {
    console.log(error.message);
    
  }
    console.log("Product Added:", formData);
    closeModal();
  };

  const openModal = (product) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  return (
    <>
      <header className="padding-x py-8 mt-5 absolute z-10  w-full ">
        <nav className="flex justify-between items-center max-container ">
          <Link to="/">
            <img
              src={headerLogo}
              alt="logo"
              width={129}
              height={29}
              className="m-0 w-[129px] h-[29px]"
            />
          </Link>

          <ul className="flex-1 flex gap-16 justify-center items-center max-lg:hidden">
            <li>
              <Link
                to="/"
                className="font-montserrat leading-normal text-lg text-slate-gray"
              >
                Home
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-montserrat leading-normal text-lg text-slate-gray"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {user.isAdmin && (
              <li
                onClick={() => openModal()}
                className="font-montserrat leading-normal text-lg text-slate-gray"
              >
                Show
              </li>
            )}
          </ul>
          <div className="flex gap-2 text-lg leading-normal font-medium font-montserrat max-lg:hidden wide:mr-24">
            {/*<a href="../sections/SignIn.jsx">Sign in</a>*/}
            <Link to="/sign-in">Sign in</Link>
            <span>/</span>
            <Link to="/sign-up">Sign Up</Link>
          </div>
          {/* hidden max-lg:block */}
          <div className="lg:hidden block">
            <img src={hamburger} alt="" height={25} width={25} />
          </div>
        </nav>
      </header>

      {isModalOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl transform transition-all scale-100">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <input
              type="file"
              required
              accept="image/*"
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-red-300 focus:outline-none"
              {...register("image", { required: true })}
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-red-300 focus:outline-none"
              placeholder="Enter product name"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              {...register("price", { required: true })}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-red-300 focus:outline-none"
              placeholder="Enter product price"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-red-300 focus:outline-none"
              rows="3"
              placeholder="Enter product description"
            ></textarea>
          </div>
          <div className="flex justify-between items-center gap-4">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:ring focus:ring-red-300 focus:outline-none transition-all"
            >
              Add Product
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
    </div>      )}
    </>
  );
}

export default Navbar;
