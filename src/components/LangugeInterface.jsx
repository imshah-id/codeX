/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { ArrowLeft } from "react-feather";

const LearningScreen = ({ language, onBack }) => {
  const [activeTab, setActiveTab] = useState("Exercise"); 

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-100 text-gray-900 flex flex-col">
     
      <header className="flex items-center gap-4 bg-indigo-400 p-2 md:p-4">
        <button className=" px-6 cursor-pointer p-2 rounded-lg" onClick={onBack}>
          <ArrowLeft/>
        </button>
        <img className="w-12" src={language.logo} alt={language.name} />
        <h2 className="md:text-2xl text-lg text-white font-bold">{language.name}</h2>
      </header>

      {/* Navigation Bar */}
      <nav className="flex bg-white  px-3">
        {["Exercise", "Practice", "Projects"].map((tab) => (
          <button
            key={tab}
            className={`mx-4 p-2 md:p-4   ${
              activeTab === tab ? "border-b-2 shadow-md" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="flex-grow flex items-center justify-center p-8">
        {activeTab === "Exercise" && (
          <p className="text-xl">📖 Exercises for {language.name}</p>
        )}
        {activeTab === "Practice" && (
          <p className="text-xl">🛠️ Practice {language.name}</p>
        )}
        {activeTab === "Projects" && (
          <p className="text-xl">🚀 Build Projects in {language.name}</p>
        )}
      </div>
    </div>
  );
};

export default LearningScreen;
