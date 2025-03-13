import { React, useState, useEffect } from "react";
import axios from "axios";
import Learning from "../pages/Learning";

const LanguageSelection = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [learn, setLearn] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [userLanguages, setUserLanguages] = useState([]);

  const uri = import.meta.env.VITE_BASE_URI;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${uri}/api/languages/language`);
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserLanguages = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${uri}/api/user/${userId}`);
        setUserLanguages(response.data.languages || []);
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setUserLanguages([]);
      }
    };

    fetchLanguages();
    fetchUserLanguages();
  }, [userId]);

  const handleNo = () => setConfirmPopup(null);

  const handleConfirm = async (language) => {
    try {
      if (!userId) return;

      await axios.post(`${uri}/api/user/add`, {
        userId,
        language: language.name,
      });

      setUserLanguages((prev) =>
        Array.isArray(prev) ? [...prev, language.name] : [language.name]
      );

      setLearn(language); // 🚀 Immediately open topics
    } catch (error) {
      console.error("Error adding language to progress:", error);
      alert("Failed to add language to progress");
    } finally {
      setConfirmPopup(null);
    }
  };

  const openConfirmPopup = (language) => {
    const isLanguageAdded =
      Array.isArray(userLanguages) && userLanguages.includes(language.name);

    if (!userId || isLanguageAdded) {
      setLearn(language); // 🚀 Open topics directly
      return;
    }

    setConfirmPopup(language);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-center">{error}</div>;

  return (
    <section className="max-w-7xl mx-auto">
      {!learn ? (
        <>
          <h2 className="md:text-4xl text-2xl font-md p-8">Select Language</h2>
          <div className="md:grid w-full flex flex-col grid-cols-2 gap-6 p-6">
            {languages.map(({ name, bio, logo }) => (
              <aside
                key={name}
                className="p-6 shadow-lg hover:scale-105 transition-transform duration-200 shadow-gray-400 flex flex-col justify-between h-full rounded-lg bg-white"
              >
                <div>
                  <img className="w-12 inline-block" src={logo} alt={name} />
                  <h2 className="inline-block p-4 font-semibold text-center text-xl">
                    {name}
                  </h2>
                  <p className="text-gray-800">{bio}</p>
                </div>
                <button
                  onClick={() => openConfirmPopup({ name, logo })}
                  className="p-3 w-full text-md hover:cursor-pointer bg-indigo-500 hover:bg-indigo-600 mt-auto text-white md:bg-indigo-400 rounded-lg transition-all"
                >
                  Start Learning
                </button>
              </aside>
            ))}
          </div>
        </>
      ) : (
        <Learning Learning={learn} onBack={() => setLearn(null)} />
      )}

      {/* ✅ Glassmorphism Confirmation Popup */}
      {confirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-[90%] max-w-md text-center animate-fadeInUp">
            <img
              src={
                confirmPopup.logo ||
                "https://cdn-icons-png.flaticon.com/512/3039/3039436.png"
              }
              alt={confirmPopup.name}
              className="w-16 h-16 mx-auto mb-4 rounded-full shadow-md"
            />
            <h3 className="text-2xl font-semibold text-gray-900">
              Add <span className="text-indigo-500">{confirmPopup.name}</span>{" "}
              to your progress?
            </h3>
            <p className="text-gray-600 mt-2">
              You can track your learning anytime.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => handleConfirm(confirmPopup)}
                className="px-6 py-2 text-lg bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-all"
              >
                Yes, Add
              </button>
              <button
                onClick={handleNo}
                className="px-6 py-2 text-lg bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LanguageSelection;
