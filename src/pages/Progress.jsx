import React, { useEffect, useState } from "react";
import axios from "axios";

const Progress = ({ userId }) => {
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/user/progress/${userId}`
        );
        setProgressData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load progress.");
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold">Loading progress...</p>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Your Learning Progress
      </h2>

      {Object.keys(progressData).length === 0 ? (
        <p className="text-gray-600 text-center">
          No progress found. Start learning now!
        </p>
      ) : (
        Object.entries(progressData).map(
          ([language, { completed, pending }]) => (
            <div
              key={language}
              className="bg-white shadow-md rounded-lg p-5 mb-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">
                {language}
              </h3>

              <div className="mb-4">
                <h4 className="text-lg font-medium text-green-500">
                  Completed Topics
                </h4>
                {completed.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {completed.map((topic, index) => (
                      <li
                        key={index}
                        className="bg-green-100 px-4 py-2 rounded-md my-1"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No topics completed yet.</p>
                )}
              </div>

              <div>
                <h4 className="text-lg font-medium text-red-500">
                  Pending Topics
                </h4>
                {pending.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {pending.map((topic, index) => (
                      <li
                        key={index}
                        className="bg-red-100 px-4 py-2 rounded-md my-1"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">All topics completed!</p>
                )}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default Progress;
