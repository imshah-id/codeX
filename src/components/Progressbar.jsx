import React, { useState, useEffect } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prog = parseInt(localStorage.getItem("prog")) || 0; // Ensure it's a number

    if (prog <= 0) return; // If no valid progress, don't run animation

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = Math.min(prevProgress + 10, prog); // Ensure it stops at prog
        if (nextProgress === prog) clearInterval(interval);
        return nextProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8">
      <div className="p-8 md:p-12 shadow-md mx-auto max-w-7xl mb-10 bg-white rounded-lg">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-indigo-700">
              Progress: {progress}%
            </h1>
          </div>
          <div className="flex mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-500 h-2.5 rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.5s ease-in-out",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProgressBar;
