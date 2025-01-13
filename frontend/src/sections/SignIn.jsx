import React, { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";



const SignIn = () => {
    const navigate = useNavigate();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
    const [error, setError] = useState("");
  
    const login = async (data) => {
      setError("");
      try {
        const session = await axios.post("/api/v1/users/login", data);
  
          toast.success("Login successful");
          navigate("/");
        
      } catch (error) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-10">
                <h2 className="text-4xl font-extrabold text-center text-coral-red mb-6">
                    Welcome Back!
                </h2>
                <p className="text-gray-600 text-center mb-8 text-lg">
                    Sign in to your account to continue.
                </p>
                <form onSubmit={handleSubmit(login)}>
                    <div className="mb-6 relative">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                className="px-4 py-3 pl-12 border border-gray-300 rounded-lg w-full focus:ring-coral-red focus:border-coral-red shadow-sm"
                                required
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                      message: "Email address must be a valid address",
                                    }
                                })
                            }
                            />
                              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 absolute top-3 left-3 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M2.94 5.06a8 8 0 1111.31 11.31A8 8 0 012.94 5.06zM10 9V5a1 1 0 00-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414l-2.707-2.707z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mb-6 relative">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="px-4 py-3 pl-12 border border-gray-300 rounded-lg w-full focus:ring-coral-red focus:border-coral-red shadow-sm"
                                required
                                {...register("password", {
                                    required: "Password is required",
                                  })}
                            />
                              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 absolute top-3 left-3 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm4 5a1 1 0 10-2 0 1 1 0 002 0zm1 3a1 1 0 10-2 0 1 1 0 002 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                className="mr-2 rounded border-gray-300 text-coral-red focus:ring-coral-red"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="text-sm text-gray-600"
                            >
                                Remember Me
                            </label>
                        </div>
                        <a
                            href="#"
                            className="text-sm text-coral-red hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-coral-red text-white py-3 rounded-lg hover:bg-red-500 transition duration-200 shadow-md font-semibold"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600 text-sm">
                    Don’t have an account?{" "}
                    <Link
                        to="/sign-up"
                        className="text-coral-red hover:underline font-medium"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
