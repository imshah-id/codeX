import React, { useState } from "react";
import Dat from "/src/data.json";
import LearningScreen from "./LangugeInterface";

const Languages = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  return (
    <section className="max-w-7xl mx-auto">
      {!selectedLanguage ? (
        <>
          <h2 className="md:text-4xl text-2xl  font-md p-8">
            Select Language
          </h2>
          <div className="md:grid flex flex-col grid-cols-2 gap-6 p-6">
            {Dat.map(({ name, logo, features }) => (
              <aside
                key={name}
                className="p-6 shadow-lg hover:scale-105 shadow-gray-400"
              >
                <img className="w-12 inline-block" src={logo} alt={name} />
                <h2 className="inline-block p-4 font-semibold text-center text-xl">
                  {name}
                </h2>
                <p className="text-gray-800">{features}</p>
                <button
                  className="p-3 w-full text-md hover:cursor-pointer bg-indigo-500 hover:bg-indigo-600 mt-6 text-white md:bg-indigo-400 rounded-lg"
                  onClick={() => setSelectedLanguage({ name, logo })}
                >
                  Start Learning
                </button>
              </aside>
            ))}
          </div>
        </>
      ) : (
        <LearningScreen
          language={selectedLanguage}
          onBack={() => setSelectedLanguage(null)}
        />
      )}
    </section>
  );
};

export default React.memo(Languages);
