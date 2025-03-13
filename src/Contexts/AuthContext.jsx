import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
    
  // Check if user is already logged in
useEffect(() => {
  const token = localStorage.getItem("token");
  const adminStatus = localStorage.getItem("isAdmin"); // ✅ Now this will not be null

  if (token) {
    setIsAuth(true);
    setIsAdmin(adminStatus === "true"); // ✅ Convert "true"/"false" string to boolean
    fetchUserProgress();
  }
}, []);


  // Fetch user progress from backend
  const fetchUserProgress = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URI}/api/user/${userId}`
      );
      const data = await response.json();

      if (response.ok) {
        setUserProgress(data);
      } else {
        console.error("Failed to fetch progress:", data.message);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuth, setIsAuth, isAdmin, setIsAdmin, userProgress }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
