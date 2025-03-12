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
        console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );
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
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <label className="block mb-2">Name:</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="w-full p-2 border rounded"
          placeholder="Enter your name"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <label className="block mt-4 mb-2">Email:</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 border rounded"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label className="block mt-4 mb-2">Password:</label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full p-2 border rounded"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full mt-4 p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Registration;
