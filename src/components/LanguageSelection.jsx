import { React, useState, useEffect } from "react";
import axios from "axios";
import Learning from "../pages/Learning";

const LanguageSelection = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [learn, setLearn] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(null);
const uri = import.meta.env.VITE_BASE_URI;
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          `${uri}/api/languages/language`
        );
        setLanguages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error!", error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);
  const handelNo = (language)=>{
    try {
      setConfirmPopup(null);
    } catch (error) {
      console.log(error)
    }
    finally{
            setLearn(language);

    }
  }
  const handleConfirm = async (language) => {
    
    try {
      const userId = localStorage.getItem("userId");

      await axios.post(`${uri}/api/user/progress/add`, {
        userId,
        language: language.name,
      });
      setLearn(language);
    } catch (error) {
      console.error("Error adding language to progress:", error);
      alert("Failed to add language to progress");
    } finally {
      setConfirmPopup(null);
    }
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
                  onClick={() => setConfirmPopup({ name, logo })}
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

      {/* Stylish Confirmation Popup */}
      {confirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96 text-center transform scale-105 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
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
                onClick={()=>handelNo(confirmPopup)} // Now correctly closes the popup
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
