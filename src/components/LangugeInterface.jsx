/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { ArrowLeft } from "react-feather";

const LearningScreen = ({ language, onBack }) => {
  const [activeTab, setActiveTab] = useState("Exercise"); 

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-100 text-gray-900 flex flex-col">
      <header className="flex items-center gap-4 bg-indigo-500 p-2 md:p-4">
        <button
          className=" px-6 cursor-pointer p-2 rounded-lg"
          onClick={onBack}
        >
          <ArrowLeft className="stroke-white" />
        </button>
        <img className="md:w-12 w-10" src={language.logo} alt={language.name} />
        <h2 className="md:text-2xl text-lg text-white font-bold">
          {language.name}
        </h2>
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
      <div className="p-6">
        {activeTab === "Exercise" && (
          <section className="s">
            <h1 className="font-semibold  text-lg md:text-2xl pb-4">
              Getting Started with {language.name}
            </h1>
            <div className="shadow-lg rounded-2xl bg-white p-8">
              <h2 className="md:text-2xl  text-gray-700 font-medium">
                Heading of topic
              </h2>
              <p>details about the same topic more like overview</p>
              <section className="flex justify-between py-4">
                <h2>Level</h2>
                <button>icon_Start</button>
              </section>
            </div>
          </section>
        )}
        {activeTab === "Practice" && (
          <div className="shadow-lg rounded-2xl bg-white p-8">
            <h2 className="md:text-2xl pb-4  text-gray-800 font-medium">
              Practice Exercises
            </h2>
            <p className="border-l-4 p-6 text-amber-800 bg-red-50 border-amber-600">
              Practice exercises are coming soon! Here you'll be able to solve
              coding challenges and improve your Python skills through
              interactive problems.
            </p>
          </div>
        )}
        {activeTab === "Projects" && (
          <div className="shadow-lg bg-white rounded-2xl p-8">
            <h2 className="md:text-2xl pb-4 text-gray-800 font-medium">
              Hands-on Projects
            </h2>
            <p className="border-l-4 p-6 text-blue-800 bg-blue-50 border-blue-600">
              Real-world projects are coming soon! You'll be able to build
              practical applications and strengthen your Python expertise
              through guided project-based learning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningScreen;
