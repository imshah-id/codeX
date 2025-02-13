import React, { useState, useEffect } from "react";

const RoundedProgressBar = () => {
  const [progress, setProgress] = useState(0);

  // Simulating progress (for example, as a timer or during an async task)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 30) {
          clearInterval(interval);
          return 30;
        }
        return prevProgress + 10; 
      });
    }, 100); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <main className="p-8">
      <div className="p-8 md:p-12 shadow-md mx-auto max-w-7xl mb-10  ">
        <div className="relative pt-1 ">
          <div className="flex mb-2 items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold">
              Progress: {progress}%
            </h1>
          </div>
          <div className="flex mb-2 ">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-500 h-2.5 rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: "width .10s ease-in-out",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoundedProgressBar;
