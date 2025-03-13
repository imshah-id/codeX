import React, { useEffect, useState } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FaArrowLeft, FaBookmark } from "react-icons/fa";
import { FiSearch, FiBookmark } from "react-icons/fi";
import axios from "axios";

const Learning = ({ Learning, onBack }) => {
  const [learn, setLearn] = useState(
    () => JSON.parse(sessionStorage.getItem("learn")) || null
  );
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarked, setBookmarked] = useState([]);
  const [progress, setProgress] = useState({ completed: [], pending: [] });
  const [isLoading, setIsLoading] = useState(true); // NEW state for loading

  const userId = localStorage.getItem("userId");
  const uri = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get(`${uri}/api/topics/listtopics`, {
          params: { nam: Learning.name },
        });
        setTopics(response.data);
        await fetchOrInitProgress(response.data);
      } catch (error) {
        console.log("Error fetching topics", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
    fetchTopics();
  }, [Learning.name]);

  async function fetchOrInitProgress(fetchedTopics) {
    try {
      const response = await axios.get(`${uri}/api/user/${userId}`);
      if (response.data[Learning.name]) {
        const completedIds = response.data[Learning.name].completed || [];
        const completedTitles = fetchedTopics
          .filter((t) => completedIds.includes(t.title))
          .map((t) => t.title);
        const pendingTitles = fetchedTopics
          .filter((t) => !completedIds.includes(t.title))
          .map((t) => t.title);
        setProgress({ completed: completedTitles, pending: pendingTitles });
      } else {
        await initializeProgress(fetchedTopics);
      }
    } catch (error) {
      console.log("Error fetching progress", error);
    }
  }

  async function initializeProgress(fetchedTopics) {
    try {
      await axios.post(`${uri}/api/user/add`, {
        userId,
        language: Learning.name,
        topics: fetchedTopics.map((t) => t._id),
      });

      setProgress({
        completed: [],
        pending: fetchedTopics.map((t) => t.title),
      });
    } catch (error) {
      console.log("Error initializing progress", error);
    }
  }

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white">
      <div className="w-full bg-gray-800">
        <nav className="flex gap-6 max-w-7xl mx-auto text-white p-2 md:p-4">
          <button className="md:text-lg" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <section className="flex items-center gap-1.5">
            <img
              className="md:w-12 w-8"
              src={Learning.logo}
              alt={Learning.name}
            />
            <h2 className="md:text-2xl text-lg font-bold">{Learning.name}</h2>
          </section>
        </nav>
      </div>

      {!learn && (
        <>
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center gap-2 mb-4">
              <FiSearch className="text-gray-600" />
              <input
                type="text"
                placeholder="Search topics..."
                className="border p-2 rounded w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <main className="bg-gray-50 h-full overflow-y-auto pb-10">
            {isLoading ? (
              <section className="max-w-7xl mx-auto text-gray-600 text-center text-lg md:text-xl p-4">
                <p>Loading...</p>
              </section>
            ) : filteredTopics.length > 0 ? (
              <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] overflow-y-auto">
                <h1 className="font-semibold text-lg md:text-2xl p-4">
                  Getting Started with {Learning.name}
                </h1>
                <div className="md:grid flex flex-col grid-cols-2 mb-12 gap-4 p-4">
                  {filteredTopics.map((t) => (
                    <div
                      key={t.title}
                      className={`bg-white hover:scale-105 rounded-2xl flex flex-col justify-around p-4 md:p-6 shadow-2xl ${
                        progress?.completed.includes(t.title)
                          ? "border-green-500 border-2"
                          : ""
                      }`}
                    >
                      <h2 className="md:text-2xl text-gray-900 font-medium">
                        {t.title}
                      </h2>
                      <p className="text-gray-600 text-sm md:text-lg">
                        {t.bio}
                      </p>
                      <div className="flex items-center justify-between">
                        <p
                          className={`rounded-2xl flex mt-10 flex-col justify-around p-1 md:p-2 shadow-2xl ${
                            progress?.completed.includes(t.title)
                              ? "border-green-500 border-2"
                              : ""
                          } ${
                            t.level === "Beginner"
                              ? "bg-green-200 text-green-900"
                              : t.level === "Intermediate"
                              ? "bg-yellow-200 text-yellow-900"
                              : "bg-red-200 text-red-900"
                          }`}
                        >
                          Level: {t.level}
                        </p>
                        <section className="flex justify-between mt-10 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setBookmarked((prev) =>
                                  prev.includes(t._id)
                                    ? prev.filter((id) => id !== t._id)
                                    : [...prev, t._id]
                                )
                              }
                              className="text-xl"
                            >
                              {bookmarked.includes(t._id) ? (
                                <FaBookmark className="text-yellow-500" />
                              ) : (
                                <FiBookmark />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setLearn(t);
                                sessionStorage.setItem(
                                  "learn",
                                  JSON.stringify(t)
                                );
                              }}
                              className="flex gap-1 items-center text-lg border rounded-2xl hover:text-indigo-800 py-1 hover:bg-white px-2 bg-blue-600 text-white cursor-pointer"
                            >
                              <IoPlayCircleOutline />
                              Start
                            </button>
                          </div>
                        </section>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <section className="max-w-7xl text-red-700 mx-auto text-medium p-4 text-center md:text-xl">
                <p>No topics available for this language.</p>
              </section>
            )}
          </main>
        </>
      )}

      {learn && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center">
          <button
            onClick={() => {
              setLearn(null);
              sessionStorage.removeItem("learn");
            }}
            className="absolute cursor-pointer top-2 right-8 px-2 text-gray-600 hover:text-red-600 text-3xl md:text-5xl"
          >
            &times;
          </button>
          <section className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg h-[90vh] overflow-y-auto relative">
            <div className="relative">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                {learn.title}
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: learn.details }}
                className="prose prose-lg max-w-full w-full overflow-x-auto p-2 border relative"
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default React.memo(Learning);
