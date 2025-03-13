import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const uri = import.meta.env.VITE_BASE_URI;
    try {
      const response = await axios.post(`${uri}/api/auth/register`, data);
      console.log("Registration Successful:", response.data);
      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      console.error(
        "Registration Failed:",
        error.response?.data || error.message
      );
      alert("Failed to register");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
          Sign Up for CodeX
        </h2>

        <div className="mb-4">
          <label className="block mb-2">Name:</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full p-3 border rounded bg-gray-700 text-white"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-3 border rounded bg-gray-700 text-white"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full p-3 border rounded bg-gray-700 text-white"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-4 p-3 rounded font-semibold text-black bg-yellow-400 hover:bg-yellow-500"
        >
          Register
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Registration;
