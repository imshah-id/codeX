import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);
  const [user, setUser] = useState({ name: "", role: "", email: "" });
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const uri = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await axios.get(`${uri}/api/profile/user/${userId}`);
          setUser(response.data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEmailChange = async () => {
    if (!newEmail.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    if (window.confirm("Are you sure you want to update your email?")) {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        await axios.put(`${uri}/api/profile/user/${userId}`, {
          email: newEmail,
        });
        setUser((prev) => ({ ...prev, email: newEmail }));
        setNewEmail("");
        setEditEmail(false);
        alert("Email updated successfully!");
      } catch (error) {
        console.error("Error updating email:", error);
        alert("Failed to update email. Try again later.");
      }
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      alert("Password should be at least 6 characters long.");
      return;
    }
    if (window.confirm("Are you sure you want to change your password?")) {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        await axios.put(`${uri}/api/profile/user/${userId}`, {
          password: newPassword,
        });
        setNewPassword("");
        setEditPassword(false);
        alert("Password changed successfully!");
      } catch (error) {
        console.error("Error changing password:", error);
        alert("Failed to change password. Try again later.");
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setIsAuth(null);
      navigate("/");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-900 text-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-3xl font-bold text-yellow-400 text-center">
        Profile
      </h2>

      <div className="mt-6 space-y-4">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span
            className={user.role === "admin" ? "text-red-400" : "text-blue-400"}
          >
            {user.role}
          </span>
        </p>

        {/* Email Section */}
        <div className="flex items-center justify-between">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <FaEdit
            className="text-yellow-400 cursor-pointer"
            onClick={() => setEditEmail(!editEmail)}
          />
        </div>
        {editEmail && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="email"
              placeholder="Enter new email"
              className="w-full p-2 bg-gray-700 text-white rounded"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <FaCheck
              className="text-green-400 cursor-pointer"
              onClick={handleEmailChange}
            />
            <FaTimes
              className="text-red-400 cursor-pointer"
              onClick={() => setEditEmail(false)}
            />
          </div>
        )}

        {/* Password Section */}
        <div className="flex items-center justify-between">
          <p>
            <strong>Password:</strong> ••••••••
          </p>
          <FaEdit
            className="text-yellow-400 cursor-pointer"
            onClick={() => setEditPassword(!editPassword)}
          />
        </div>
        {editPassword && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 bg-gray-700 text-white rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FaCheck
              className="text-green-400 cursor-pointer"
              onClick={handlePasswordChange}
            />
            <FaTimes
              className="text-red-400 cursor-pointer"
              onClick={() => setEditPassword(false)}
            />
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        className="w-full mt-6 p-3 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
