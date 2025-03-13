import React, { useEffect, useState } from "react";
import axios from "axios";

const Progress = () => {
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

        let topicsResults = {};

        await Promise.all(
          Object.keys(userProgress).map(async (language) => {
            try {
              const topicsResponse = await axios.get(
                `${uri}/api/topics/listtopics`,
                { params: { nam: language } }
              );
              topicsResults[language] = topicsResponse.data || [];
            } catch {
              topicsResults[language] = [];
            }
          })
        );

        setProgressData(userProgress);
        setTopicsData(topicsResults);

        // Calculate overall progress here
        let totalCompleted = 0;
        let totalTopics = 0;

        Object.entries(userProgress).forEach(([language, progress]) => {
          const completed = progress?.completed || [];
          const allTopics = topicsResults[language] || [];
          totalCompleted += completed.length;
          totalTopics += allTopics.length;
        });

        const overallProgress = totalTopics
          ? Math.round((totalCompleted / totalTopics) * 100)
          : 0;

        // Store overall progress in localStorage
        localStorage.setItem("overallProg", overallProgress);
      } catch {
        setError("Failed to load progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressAndTopics();
  }, []);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold text-gray-600">
        Loading progress...
      </p>
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

          const allTopicTitles = allTopics.map((t) =>
            t.title.trim().toLowerCase()
          );
          const completedTitles = completed.map((t) => t.trim().toLowerCase());

          const pendingTopics = allTopicTitles.filter(
            (title) => !completedTitles.includes(title)
          );

          const totalTopics = allTopics.length;
          const progressPercentage = totalTopics
            ? Math.round((completed.length / totalTopics) * 100)
            : 0;

          return (
            <div
              key={language}
              className="bg-white shadow-lg rounded-2xl p-6 mb-6 transition-transform hover:scale-[1.02]"
            >
              <h3 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center justify-between">
                {language}
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
                  {progressPercentage}% Completed
                </span>
              </h3>

              {/* Blue Progress Bar */}
              <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-4">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Completed Topics */}
                <div className="bg-green-50 p-4 rounded-lg shadow-md">
                  <h4 className="text-lg font-medium text-green-600 mb-2">
                    ✅ Completed Topics
                  </h4>
                  {completed.length > 0 ? (
                    <ul className="space-y-2">
                      {completed.map((topic, index) => (
                        <li
                          key={index}
                          className="bg-green-200 px-4 py-2 rounded-md text-gray-800 text-sm font-semibold"
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
                <div className="bg-red-50 p-4 rounded-lg shadow-md">
                  <h4 className="text-lg font-medium text-red-600 mb-2">
                    ⏳ Pending Topics
                  </h4>
                  {pendingTopics.length > 0 ? (
                    <ul className="space-y-2">
                      {pendingTopics.map((topic, index) => (
                        <li
                          key={index}
                          className="bg-red-200 px-4 py-2 rounded-md text-gray-800 text-sm font-semibold"
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
