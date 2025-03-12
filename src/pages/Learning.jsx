import React, { useEffect, useState } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FaArrowLeft, FaBookmark } from "react-icons/fa";
import { FiSearch, FiBookmark } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import axios from "axios";

const Learning = ({ Learning, onBack, userId }) => {
  const [learn, setLearn] = useState(null); // Stores selected topic
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarked, setBookmarked] = useState([]);
  const [progress, setProgress] = useState({ completed: [], pending: [] });
    const uri = localStorage.getItem("base_uri");

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get(
          `${uri}/api/topics/listtopics`,
          { params: { nam: Learning.name } }
        );
        setTopics(response.data);

        // Fetch or Initialize user progress
        await fetchOrInitProgress(response.data);
      } catch {
        console.log("Error fetching topics");
      }
    }
    fetchTopics();
  }, [Learning.name]);

  // Fetch user progress or initialize if not exists
  async function fetchOrInitProgress(fetchedTopics) {
    try {
      const response = await axios.get(
        `${uri}/api/progress/${userId}`
      );

      // If language progress exists, update state
      if (response.data[Learning.name]) {
        setProgress(response.data[Learning.name]);
      } else {
        // If not, initialize progress
        await initializeProgress(fetchedTopics);
      }
    } catch (error) {
      console.log("Error fetching progress", error);
    }
  }

  // Initialize user progress for the selected language
  async function initializeProgress(fetchedTopics) {
    try {
      const response = await axios.post(
        `${uri}/api/progress/add`,
        {
          userId,
          language: Learning.name,
          topics: fetchedTopics.map((t) => t._id),
        }
      );
      setProgress(response.data.progress.languages[Learning.name]);
    } catch (error) {
      console.log("Error initializing progress", error);
    }
  }

  // Mark topic as completed
  async function markAsCompleted(topic) {
    try {
      await axios.post(`${uri}/api/progress/complete`, {
        userId,
        language: Learning.name,
        topic,
      });

      // Move topic from pending to completed in UI
      setProgress((prev) => ({
        completed: [...prev.completed, topic],
        pending: prev.pending.filter((id) => id !== topic),
      }));
    } catch (error) {
      console.log("Error marking topic as completed", error);
    }
  }

  const toggleBookmark = (topicId) => {
    setBookmarked((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white">
      {/* Navbar */}
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

      {/* Hide content when modal is open */}
      {!learn && (
        <>
          {/* Search Bar */}
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

          {/* Main Content */}
          <main className="bg-gray-50 h-full overflow-y-auto">
            {filteredTopics.length > 0 ? (
              <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] overflow-y-auto">
                <h1 className="font-semibold text-lg md:text-2xl p-4">
                  Getting Started with {Learning.name}
                </h1>
                <div className="md:grid flex flex-col grid-cols-2 gap-4 p-4">
                  {filteredTopics.map((t) => (
                    <div
                      key={t._id}
                      className={`bg-white hover:scale-105 rounded-2xl flex flex-col justify-around p-4 md:p-6 shadow-2xl ${
                        progress.completed.includes(t._id)
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
                      <section className="flex justify-between mt-10 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleBookmark(t._id)}
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
                              markAsCompleted(t._id);
                            }}
                            className="flex gap-1 items-center text-lg border rounded-2xl hover:text-indigo-800 py-1 hover:bg-white px-2 bg-blue-600 text-white cursor-pointer"
                          >
                            <IoPlayCircleOutline />
                            Start
                          </button>
                        </div>
                      </section>
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

      {/* Learning Modal */}
      {learn && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center">
          <section className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{learn.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: learn.details }}
              className="overflow-y-auto max-h-[70vh] p-2 border"
            />
            <button
              onClick={() => setLearn(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default React.memo(Learning);
