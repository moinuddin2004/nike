import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const SignUp = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Add useNavigate hook for redirection

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const create = async (data) => {
    setError("");
   const user = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };

    try {
      const userData = await axios.post("/api/v1/users/register", user);

      // Redirect to login page after successful registration
      if (userData) {
        toast.success("Account created successfully");
        navigate("/sign-in"); // Navigate to login page
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-center text-coral-red mb-6">
          Create Your Account
        </h2>
        <p className="text-gray-600 text-center mb-8 text-lg">
          Sign up to get started!
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-coral-red focus:border-coral-red shadow-sm"
              required
              {...register("fullName", {
                required: "Full name is required",
              })}
            />
            {errors.fullName && (
              <p className="text-red-600">{errors.fullName.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-coral-red focus:border-coral-red shadow-sm"
              required
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Email address must be a valid address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-coral-red focus:border-coral-red shadow-sm"
              required
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-coral-red text-white py-3 rounded-lg hover:bg-red-500 transition duration-200 shadow-md font-semibold"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-8 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-coral-red hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
