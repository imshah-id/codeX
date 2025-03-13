import { useState, useEffect } from "react";
import axios from "axios";
import Learning from "../pages/Learning";

const LanguageSelection = () => {
  const [languages, setLanguages] = useState([]);
  const [learn, setLearn] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [userLanguages, setUserLanguages] = useState(new Set());
  const [loading, setLoading] = useState(true); // Track loading state

  const uri = import.meta.env.VITE_BASE_URI;
  const userId = localStorage.getItem("userId");

  // Function to fetch languages and user data
  const fetchData = async () => {
    try {
      if (!userId) {
        setLoading(false); // If no userId, we stop loading
        return;
      }

      // Load previously stored user languages from localStorage
      const storedLanguages =
        JSON.parse(localStorage.getItem("userLanguages")) || [];

      // Fetch languages and user data concurrently
      const [langRes, userRes] = await Promise.all([
        axios.get(`${uri}/api/languages/language`),
        axios.get(`${uri}/api/user/${userId}`),
      ]);

      // Handle new user without any languages
      const userLangs = userRes.data.languages
        ? new Set([
            ...storedLanguages,
            ...(typeof userRes.data.languages === "object"
              ? Object.keys(userRes.data.languages)
              : []),
          ])
        : new Set(storedLanguages); // For new users, use stored languages or empty set

      // Update state
      setLanguages(langRes.data);
      setUserLanguages(userLangs);
      localStorage.setItem("userLanguages", JSON.stringify([...userLangs]));
      setLoading(false); // Stop loading once the data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Stop loading on error
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]); // Re-fetch data if userId changes

  // Handle adding a language to the user's progress
  const handleConfirm = async (language) => {
    if (!userId) return;

    try {
      await axios.post(`${uri}/api/user/add`, {
        userId,
        language: language.name,
      });

      setUserLanguages((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.add(language.name);
        localStorage.setItem("userLanguages", JSON.stringify([...updatedSet]));
        return updatedSet;
      });

      setLearn(language);
    } catch (error) {
      console.error("Error adding language:", error);
    } finally {
      setConfirmPopup(null);
    }
  };

  // Open confirmation popup when user clicks "Start Learning"
  const openConfirmPopup = (language) => {
    if (!userId || userLanguages.has(language.name)) {
      setLearn(language); // Skip popup if already added
    } else {
      setConfirmPopup(language);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading languages...</div>; // Show loading state
  }

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
                  className="p-3 w-full text-md bg-indigo-500 hover:bg-indigo-600 mt-auto text-white rounded-lg transition-all"
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

      {confirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-[90%] max-w-md text-center">
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
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => handleConfirm(confirmPopup)}
                className="px-6 py-2 text-lg bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600"
              >
                Yes, Add
              </button>
              <button
                onClick={() => setConfirmPopup(null)}
                className="px-6 py-2 text-lg bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400"
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
