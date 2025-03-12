import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", role: "", email: "" });
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (userId) {
          const response = await axios.get(
            `http://localhost:5000/api/profile/user/${userId}`
          );
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

  // Function to update email
  const handleEmailChange = async () => {
    if (!newEmail.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    if (window.confirm("Are you sure you want to update your email?")) {
      try {
        const userId = localStorage.getItem("userId");
        await axios.put(`http://localhost:5000/api/profile/user/${userId}`, {
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
    }
  };

  // Function to change password
  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      alert("Password should be at least 6 characters long.");
      return;
    }

    if (window.confirm("Are you sure you want to change your password?")) {
      try {
        const userId = localStorage.getItem("userId");
        await axios.put(`http://localhost:5000/api/profile/user/${userId}`, {
          password: newPassword,
        });

        setNewPassword("");
        setEditPassword(false);
        alert("Password changed successfully!");
      } catch (error) {
        console.error("Error changing password:", error);
        alert("Failed to change password. Try again later.");
      }
    }
  };

  // Function to logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>

      {/* User Info */}
      <div className="mt-4 space-y-3">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span
            className={user.role === "admin" ? "text-red-500" : "text-blue-500"}
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
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => setEditEmail(!editEmail)}
          />
        </div>
        {editEmail && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="email"
              placeholder="Enter new email"
              className="border p-2 w-full"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <FaCheck
              className="text-green-500 cursor-pointer text-xl"
              onClick={handleEmailChange}
            />
            <FaTimes
              className="text-red-500 cursor-pointer text-xl"
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
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => setEditPassword(!editPassword)}
          />
        </div>
        {editPassword && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="password"
              placeholder="Enter new password"
              className="border p-2 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FaCheck
              className="text-green-500 cursor-pointer text-xl"
              onClick={handlePasswordChange}
            />
            <FaTimes
              className="text-red-500 cursor-pointer text-xl"
              onClick={() => setEditPassword(false)}
            />
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        className="bg-red-500 text-white px-4 py-2 mt-6 w-full rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
