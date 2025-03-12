import React from "react";
import Details from "./Details";

import ProgressBar from "./Progressbar";
import LanguageSelection from "./LanguageSelection";
const Header = () => {
const BASE_URI = import.meta.env.VITE_BASE_URI;
  localStorage.setItem("base_uri",BASE_URI);
  return (
    <>
      <header className="flex flex-col  items-center">
        <h1 className="md:text-4xl text-xl font-bold pt-14 text-gray-900">
          Master Programming Languages
        </h1>
        <p className=" md:text-2xl text-lg text-center text-gray-500 p-2 md:p-4 w-[80%]">
          Learn through interactive exercises, challanges, and projects. Track
          your progress and become a better programmer
        </p>
      </header>
      <Details />
      <ProgressBar />
      <LanguageSelection/>
    </>
  );
};

export default Header;
