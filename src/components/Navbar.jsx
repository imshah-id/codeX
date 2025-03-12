import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CgCodeSlash, CgProfile } from "react-icons/cg";
import { RiHome2Line } from "react-icons/ri";
import { FaMedal } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoLogInOutline } from "react-icons/io5";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    setIsAuth(!!token);
    setIsAdmin(role === "admin");
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: <RiHome2Line /> },
    !isAuth && { label: "Login", href: "/login", icon: <IoLogInOutline /> },
    isAuth && { label: "Progress", href: "/progress", icon: <FaMedal /> },
    isAuth && { label: "Profile", href: "/profile", icon: <CgProfile /> },
    isAuth &&
      isAdmin && {
        label: "Admin",
        href: "/admin",
        icon: <MdAdminPanelSettings />,
      }, 
  ].filter(Boolean);

  return (
    <div className="w-full bg-gray-900">
      <nav className="max-w-7xl mx-auto bg-gray-900 text-white p-3 md:p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <CgCodeSlash className="text-yellow-400" />
          <h1>CodeX</h1>
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <IoClose /> : <GiHamburgerMenu />}
        </button>

        <ul
          className={`absolute md:static top-13 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent transition-all duration-300 ${
            menuOpen ? "flex flex-col items-center p-4" : "hidden md:flex"
          } md:flex-row md:gap-6`}
        >
          {navItems.map(({ label, href, icon }) => (
            <li key={label} className="py-2 md:py-0">
              <Link
                to={href}
                className="flex items-center gap-2 hover:text-yellow-400 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
