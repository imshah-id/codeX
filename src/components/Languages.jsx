import React from "react";
import Dat from "/src/data.json";

const Languages = () => {
  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="md:text-4xl text-2xl shadow-lg  font-md p-8 ">Select Language</h2>
      <div className="md:grid flex flex-col grid-cols-2 gap-6 p-6">
        {Dat.map(({ name, logo, features }) => (
          <aside key={name} className=" p-6  shadow-lg hover:scale-105 shadow-gray-400">
            <img className="w-12 inline-block " src={logo} alt={name} />
            <h2 className="inline-block p-4 font-semibold text-center text-xl">
              {name}
            </h2>
            <p className="text-gray-800">{features} </p>
            <button className="p-3 w-full text-md hover:cursor-pointer hover:bg-indigo-500 indent-1 mt-6 text-white bg-indigo-400 rounded-lg">
              Start Learning
            </button>
          </aside>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Languages);
