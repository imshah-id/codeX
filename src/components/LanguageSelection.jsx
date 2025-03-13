import { React, useState, useEffect } from "react";
import axios from "axios";
import Learning from "../pages/Learning";

const LanguageSelection = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [learn, setLearn] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [userLanguages, setUserLanguages] = useState([]); // ✅ Ensure it's initialized as an array

  const uri = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${uri}/api/languages/language`);
        setLanguages(response.data);
      } catch (error) {
        console.error("There was an error!", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserLanguages = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${uri}/api/user/${userId}`);
        setUserLanguages(response.data.languages || []); // ✅ Ensure it's an array
      } catch (error) {
        console.error("Failed to fetch user progress:", error);
        setUserLanguages([]); // ✅ Default to empty array in case of error
      }
    };

    fetchLanguages();
    fetchUserLanguages();
  }, []);

  const handleNo = () => {
    setConfirmPopup(null);
  };

  const handleConfirm = async (language) => {
    try {
      const userId = localStorage.getItem("userId");

      await axios.post(`${uri}/api/user/add`, {
        userId,
        language: language.name,
      });

      setUserLanguages((prev) =>
        Array.isArray(prev) ? [...prev, language.name] : [language.name]
      );

    } catch (error) {
      console.error("Error adding language to progress:", error);
      alert("Failed to add language to progress");
    } finally {
      setConfirmPopup(null);
    }
  };

 const openConfirmPopup = (language) => {
   if (Array.isArray(userLanguages) && userLanguages.includes(language.name)) {
     setLearn(language);
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

      {/* ✅ Glassmorphism Confirmation Popup with Background Effect */}
      {confirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg">
          {/* Background Effect */}
          <div className="absolute inset-0 bg-[url('/path-to-pattern.png')] opacity-20 z-0"></div>

          <div className="bg-white/20 backdrop-blur-2xl p-8 rounded-2xl shadow-xl w-96 text-center border border-white/30 relative z-10">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-6">
              Add {confirmPopup.name} to your progress?
            </h3>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => handleConfirm(confirmPopup)}
                className="px-6 py-2 text-lg bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
              >
                Yes
              </button>
              <button
                onClick={handleNo}
                className="px-6 py-2 text-lg bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LanguageSelection;
