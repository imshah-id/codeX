import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; 
import Progress from "./pages/Progress";
import Registration from "./pages/Registration";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Learning from "./pages/Learning";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("userRole") === "admin"
  );
    
  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(!!localStorage.getItem("token"));
      setIsAdmin(localStorage.getItem("userRole") === "admin");
    };

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/progress" element={<Progress/>} />
        <Route
          path="/profile"
          element={isAuth ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/learn"
          element={isAuth ? <Learning /> : <Navigate to="/login" />}
        />

        {/* ✅ Fix: Pass isAuth & isAdmin to AdminRoute */}
        <Route element={<AdminRoute isAuth={isAuth} isAdmin={isAdmin} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
