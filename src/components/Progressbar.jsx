import React, { useState, useEffect } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const overallProgress = parseInt(localStorage.getItem("overallProg")) || 0; // Retrieve overall progress from localStorage

    if (overallProgress <= 0) return; // If no valid progress, don't run animation

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = Math.min(prevProgress + 10, overallProgress); // Ensure it stops at overallProgress
        if (nextProgress === overallProgress) clearInterval(interval); // Stop interval when progress reaches overall progress
        return nextProgress;
      });
    }, 100);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <main className="p-8">
      <div className="p-8 md:p-12 shadow-md mx-auto max-w-7xl mb-10 bg-white rounded-lg">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-indigo-700">
              Overall Progress: {progress}%
            </h1>
          </div>
          <div className="flex mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-500 h-2.5 rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.5s ease-in-out", // Smooth transition
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
