/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { ArrowLeft, BookOpen, Code, Layout,PlayCircle,X } from "react-feather";
import Exercise from "/src/data/exercise.json";

const LearningScreen = ({ language, onBack }) => {
  const [activeTab, setActiveTab] = useState("Exercise");
  const [learn ,setLearn] =useState(null)
  const filteredLanguage = Exercise.languages.find(
    (data) => data.name === language.name
  );
  
  // Icons for different tabs
  const icons = (tab) => {
    switch (tab) {
      case "Exercise":
        return <BookOpen  />;
      case "Practice":
        return <Code  />;
      case "Projects":
        return <Layout  />;
      default:
        return null;
    }
  };
  const levelColor = (xyz) => {
    switch (xyz) {
      case "Beginner":
        return "bg-green-100 text-green-900";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-900";
      case "Advanced":
        return "bg-red-100 text-red-900";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto ">
      <div className="fixed top-0 left-0 w-full h-full bg-gray-50 text-gray-900 flex flex-col">
        <header className=" gap-4 bg-indigo-500 p-2 md:p-4">
          <div className="flex items-center max-w-7xl mx-auto">
            <button
              className="px-6 cursor-pointer p-2 rounded-lg"
              onClick={onBack}
            >
              <ArrowLeft className="stroke-white" />
            </button>
            <img
              className="md:w-12 w-10"
              src={language.logo}
              alt={language.name}
            />
            <h2 className="md:text-2xl text-lg text-white font-bold">
              {language.name}
            </h2>
          </div>
        </header>

        {/* Navigation Bar */}
        <div>
          <nav className="flex bg-white max-w-7xl mx-auto ">
            {["Exercise", "Practice", "Projects"].map((tab) => (
              <button
                key={tab}
                className={`md:mx-4 mx-auto flex cursor-pointer gap-1 w-fit  p-1 md:p-4 ${
                  activeTab === tab ? "border-b-2 shadow-md" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {icons(tab)} <span className="inline-block">{tab}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "Exercise" &&
          (!learn ? (
            <main>
              <section className="max-w-7xl mx-auto">
                <h1 className="font-semibold text-lg md:text-2xl p-4">
                  Getting Started with {language.name}
                </h1>
                {filteredLanguage ? (
                  <div className="md:grid flex flex-col grid-cols-2  gap-4  p-4">
                    {filteredLanguage.topics.map((topic, index) => (
                      <div
                        key={index}
                        className="bg-white hover:scale-105 rounded-2xl flex flex-col justify-around p-4  md:p-6  shadow-2xl"
                      >
                        <h2 className="md:text-2xl text-gray-900 font-medium">
                          {topic.name}
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg">
                          {topic.intro}
                        </p>
                        <section className="flex justify-between mt-10 py-">
                          <h2
                            className={`${levelColor(
                              topic.level
                            )} md:text-base text-bold rounded-xl p-2`}
                          >
                            Level: {topic.level}
                          </h2>
                          <button
                            onClick={() =>
                              setLearn({
                                title: topic.name,
                                intro: topic.intro,
                                details: topic.details,
                              })
                            }
                            className=" flex gap-1 text-indigo-800 py-2 px-4 cursor-pointer rounded"
                          >
                            {<PlayCircle />}Start
                          </button>
                        </section>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No topics available for this language.</p>
                )}
              </section>
            </main>
          ) : (
            <section className="relative shadow-2xl mx-auto max-w-7xl mt-5 rounded-2xl h-dvh bg-white p-2">
              <X
                className="absolute cursor-pointer right-2"
                onClick={() => setLearn(null)}
              />
              <header
                className="
                  pb-3"
              >
                <h1 className="md:text-4xl text-lg font-semibold text-gray-900   p-2">
                  {learn.title}
                </h1>

                <p className="p-2 md:text-2xl text-gray-700 ">{learn.intro}</p>
              </header>
              <p className="p-2 pt-3 md:text-xl text-gray-500 ">
                {learn.details}
              </p>
            </section>
          ))}

        {activeTab === "Practice" && (
          <div className="shadow-lg rounded-2xl max-w-7xl mx-auto mt-10 bg-white p-8">
            <h2 className="md:text-2xl pb-4 text-gray-800 font-medium">
              Practice Exercises
            </h2>
            <p className="border-l-4 text-sm md:text-lg p-4 md:p-6 text-amber-800 bg-red-50 border-amber-600">
              Practice exercises are coming soon! Here you'll be able to solve
              coding challenges and improve your {language.name} skills through
              interactive problems.
            </p>
          </div>
        )}

        {activeTab === "Projects" && (
          <div className="shadow-lg bg-white rounded-2xl max-w-7xl mt-10 mx-auto p-8">
            <h2 className="md:text-2xl pb-4 text-gray-800 font-medium">
              Hands-on Projects
            </h2>
            <p className="border-l-4 text-sm md:text-lg p-4 md:p-6 text-blue-800 bg-blue-50 border-blue-600">
              Real-world projects are coming soon! You'll be able to build
              practical applications and strengthen your {language.name}{" "}
              expertise through guided project-based learning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningScreen;
