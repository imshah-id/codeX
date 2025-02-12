import React, { useState, useEffect } from "react";

const RoundedProgressBar = () => {
  const [progress, setProgress] = useState(0);

  // Simulating progress (for example, as a timer or during an async task)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10; // Increment progress by 10% each interval
      });
    }, 1000); // Update progress every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  return (
    <div className=" p-12 shadow-lg mx-auto max-w-7xl mb-10  ">
      <div className="relative pt-1 ">
        <div className="flex mb-2 items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Progress: {progress}%</h1>
        </div>
        <div className="flex mb-2 ">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-500 h-2.5 rounded-full"
              style={{ width: `${progress}%`, transition: "width 0.s ease-in-out" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundedProgressBar;
