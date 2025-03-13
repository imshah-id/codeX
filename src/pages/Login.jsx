import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext"; 

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuth ,setIsAdmin} = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // Loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const uri = import.meta.env.VITE_BASE_URI;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${uri}/api/auth/login`, data);
      const { id, role, token } = response.data.user;
      localStorage.setItem('userId',id)
      setIsAuth({
        isAuth: true,
        userId: id,
        userRole: role,
        token: token,
      });
      // Store in localStorage for persistence
      localStorage.setItem("userId", id);
      localStorage.setItem("userRole", role);
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", role === "admin" ? "true" : "false");
      
      role === "admin"? setIsAdmin(true) : setIsAdmin(false);
      window.dispatchEvent(new Event("storage"));
      alert("Login Successful!");
      navigate("/profile");
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
          Login to CodeX
        </h2>

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
            {...register("password", { required: "Password is required" })}
            className="w-full p-3 border rounded bg-gray-700 text-white"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 p-3 rounded font-semibold text-black ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Sign Up Link */}
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
