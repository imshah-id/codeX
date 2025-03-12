import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
const uri = import.meta.env.VITE_BASE_URI;


  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${uri}/api/auth/login `,
        data
      );

      console.log("Login Response:", response.data); 
      const { id, role } = response.data.user;
      localStorage.setItem("userId", id);
      localStorage.setItem("userRole", role);
      localStorage.setItem("token", response.data.token);
      window.dispatchEvent(new Event("storage")); 

      alert("Login Successful!");
      navigate("/profile");
      window.location.reload();
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <label className="block mb-2">Email:</label>
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
          {...register("password", { required: "Password is required" })}
          className="w-full p-2 border rounded"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
