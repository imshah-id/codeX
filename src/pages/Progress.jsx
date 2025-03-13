import React, { useEffect, useState } from "react";
import axios from "axios";

const Progress = ({ userId }) => {
  const [progressData, setProgressData] = useState({});
  const [topicsData, setTopicsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const uri = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    const fetchProgressAndTopics = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const progressResponse = await axios.get(`${uri}/api/user/${userId}`);
        const userProgress = progressResponse.data.languages || {};

        // Fetch topics only for languages in user's progress
        const topicsResults = {};
        for (const language of Object.keys(userProgress)) {
          const topicsResponse = await axios.get(
            `${uri}/api/topics/listtopics`,
            {
              params: { nam: language },
            }
          );
          topicsResults[language] = topicsResponse.data;
        }

        setProgressData(userProgress);
        setTopicsData(topicsResults);
        setLoading(false);
      } catch (err) {
        setError("Failed to load progress.");
        setLoading(false);
      }
    };

    fetchProgressAndTopics();
  }, [userId]);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold">Loading progress...</p>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        📚 Your Learning Progress
      </h2>

      {Object.keys(progressData).length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No progress found. Start learning now! 🚀
        </p>
      ) : (
        Object.entries(progressData).map(([language, progress]) => {
          const completed = progress?.completed || [];
          const allTopics = topicsData[language] || [];

          // Filter pending topics (all topics excluding completed ones)
          const pendingTopics = allTopics
            .map((t) => t.title)
            .filter((title) => !completed.includes(title));

          // Calculate progress percentage
          const totalTopics = allTopics.length;
          const progressPercentage = totalTopics
            ? Math.round((completed.length / totalTopics) * 100)
            : 0;
          localStorage.setItem('prog',progressPercentage)
          return (
            <div
              key={language}
              className="bg-white shadow-lg rounded-lg p-6 mb-6"
            >
              <h3 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center">
                {language}
                <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg">
                  {progressPercentage}% Completed
                </span>
              </h3>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Completed Topics */}
                <div>
                  <h4 className="text-lg font-medium text-green-500 mb-2">
                    ✅ Completed Topics
                  </h4>
                  {completed.length > 0 ? (
                    <ul className="space-y-2">
                      {completed.map((topic, index) => (
                        <li
                          key={index}
                          className="bg-green-100 px-4 py-2 rounded-md text-gray-800 text-sm font-semibold"
                        >
                          {topic}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No topics completed yet.</p>
                  )}
                </div>

                {/* Pending Topics */}
                <div>
                  <h4 className="text-lg font-medium text-red-500 mb-2">
                    ⏳ Pending Topics
                  </h4>
                  {pendingTopics.length > 0 ? (
                    <ul className="space-y-2">
                      {pendingTopics.map((topic, index) => (
                        <li
                          key={index}
                          className="bg-red-100 px-4 py-2 rounded-md text-gray-800 text-sm font-semibold"
                        >
                          {topic}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">All topics completed! 🎉</p>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Progress;
