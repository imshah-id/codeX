import React,{useRef} from "react";
import { BookOpen,Code,User ,Award } from "react-feather";

const Nav = () => {
  const menuItems = [
    { href: "", label: "Learn", icon: "learn" },
    { href: "", label: "Practice", icon: "practice" },
    { href: "", label: "Progress", icon: "progress" },
    { href: "", label: "Profile", icon: "profile" },
  ];
 
const navBar = useRef(null);

  const showFunction = () => {
    if (navBar.current) {
      navBar.current.classList.toggle("hidden");
      console.log(navBar.current.classList.contains("hidden") ? "hidden" : "visible");
    }
  };

  const renderIcon = (icon) => {
    switch (icon) {
      case "learn":
        return (
          <BookOpen/>
        );
      case "practice":
        return (
         <Code/>
        );
      case "progress":
        return (
            <Award/>
        );
      case "profile":
        return (
          <User/>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className=" bg-indigo-500 w-full">
      <nav className="flex relative max-w-7xl mx-auto flex-col justify-between items-start md:flex-row p-3 pr-10 pl-10 md:items-center  bg-indigo-500 text-white">
        <div>
          <svg
            className="w-9 inline-block mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20"
                stroke="#ffffff"
              ></path>{" "}
            </g>
          </svg>
          <h2 className="text-2xl inline-block font-bold">CodeX</h2>
        </div>
        <button onClick={showFunction} className="md:hidden absolute right-3">
          <svg
            className="h-12 md:hidden"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff"></path>{" "}
            </g>
          </svg>
        </button>
        <ul className="md:flex  hidden gap-5 font-medium">
          {menuItems.map(({ href, label, icon }) => (
            <li className="md:opacity-70  hover:opacity-100 pr-0.5" key={label}>
              <a href={href} className="flex gap-1">
                {renderIcon(icon)} {label}
              </a>
            </li>
          ))}
        </ul>
        <ul ref={navBar} className="text-lg hidden">
          <li>
            <a href="">Learn</a>
          </li>
          <li>
            <a href="">Pratice</a>
          </li>
          <li>
            <a href="">Progress</a>
          </li>
          <li>
            <a href="">Profile</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default React.memo(Nav);
