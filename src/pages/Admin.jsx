import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { IoMdArrowDropright } from "react-icons/io";
import axios from "axios";
import { CgClose } from "react-icons/cg";
import { MdDeleteForever } from "react-icons/md";

const Admin = () => {
  const [data, setData] = useState({
    languages: [],
    topics: [],
    selectedLanguage: "",
    selectedTopic: "",
  });
  const [tobeDeleted,setDeleted]= useState('')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState(""); // "add", "edit", or "view"
  const [isOn, setOn] = useState(false); // Initially set to false, toggle visibility of form
  const [editLan, setEditLan] = useState(false);
  const [lanName, setLanName] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch Languages
  const fetchLanguages = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/languages/language"
      );
      setData((prevData) => ({ ...prevData, languages: response.data }));
    } catch (err) {
      console.error("Error fetching languages:", err);
      setError("Failed to fetch languages");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Topics based on selected language
  const fetchTopics = useCallback(async () => {
    if (!data.selectedLanguage) return;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/topics/listtopics",
        {
          params: { nam: data.selectedLanguage },
        }
      );
      setData((prevData) => ({ ...prevData, topics: response.data }));
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  }, [data.selectedLanguage]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  useEffect(() => {
    fetchTopics();
  }, [data.selectedLanguage, fetchTopics]);

  const handleLanguageChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      selectedLanguage: e.target.value,
      selectedTopic: "", // Reset selected topic on language change
    }));
    setFormMode("view"); // Reset form mode when language changes
    reset(); // Reset form fields
  };

  const handleTopicChange = (e) => {
    const selectedTopic = e.target.value;
    setData((prevData) => ({
      ...prevData,
      selectedTopic: selectedTopic,
    }));

    // If the topic is selected in "edit" mode, load its data into the form
    if (selectedTopic) {
      const selectedTopicData = data.topics.find(
        (t) => t.title === selectedTopic
      );
      setFormMode("edit");
      setValue("title", selectedTopicData?.title || "");
      setValue("bio", selectedTopicData?.bio || "");
      setValue("details", selectedTopicData?.details || "");
      setValue("level", selectedTopicData?.level || "");
    }
  };
const handelDeletes = async (tobeDeleted) => {
  try {
    console.log(tobeDeleted)
    await axios.delete(
      `http://localhost:5000/api/languages/landelete/${tobeDeleted}`
    );
    setData((prevData) => ({
      ...prevData,
      languages: prevData.languages.filter(
        (language) => language.name !== tobeDeleted
      ),
    }));
    alert("Language deleted successfully!");
  } catch (error) {
    console.log(error);
    alert("Failed to delete language.");
  }
};

  const handleSubmitForm = async (formData) => {
    try {
      if (formMode === "add") {
        formData.name = data.selectedLanguage;
        await axios.post("http://localhost:5000/api/topics/addtopic", {
          language: data.selectedLanguage,
          ...formData,
        });
        alert("New topic added successfully!");
      } else if (formMode === "edit") {
        formData.name = data.selectedLanguage;
        await axios.put("http://localhost:5000/api/topics/topicput", {
          ...formData,
        });
        alert("Topic updated successfully!");
      }else if (isOn){
        try {
            await axios.post("http://localhost:5000/api/languages/addlan",

        {...formData})
                alert("Language has been added successfully!");

      } catch (error) {
          console.log(error)
        }
      } 
      else if (editLan === "langedit") {
        try {
          formData.name = lanName;
          console.log(formData);
          await axios.put("http://localhost:5000/api/languages/updatelan",
            
          {...formData}
          );
                  alert("Language has been updated successfully!");
                  setEditLan('')
        } catch (error) {
          console.log("error at name update for the language", error);
        }
      }
      setFormMode("view");
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error(
        `Error ${formMode === "add" ? "adding" : "updating"} topic:`,
        error
      );
      alert(`Failed to ${formMode === "add" ? "add" : "update"} topic`);
    }
  };
  const handleDeleteTopic = async (topicId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this topic?"
    );

    if (confirmDelete) {
      try {
         await axios.delete(
          `http://localhost:5000/api/topics/deletetopic/${topicId}`
        );
        setData((prevData) => ({
          ...prevData,
          topics: prevData.topics.filter((topic) => topic._id !== topicId),
        }));
        alert("Topic deleted successfully");
      } catch (error) {
        console.error("Error deleting topic:", error);
        alert("Failed to delete topic");
      }
    } else {
      alert("Deletion canceled");
    }
  };

  const handelBtnClick =()=>{
    editLan===true ?setEditLan(!editLan): setEditLan(false)
    setOn(!isOn)
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="my-6 shadow-md p-4 md:p-6">
        <h2 className="text-lg font-semibold">Languages</h2>
        <ul className="flex  flex-col">
          {data.languages.map((language) => (
            <li
              key={language._id}
              className="flex justify-between items-center py-2"
            >
              <span>{language.name}</span>
              <section className="flex items-center">
                <button
                  onClick={() => {
                    setEditLan("langedit");
                    setLanName(language.name);
                  }}
                  className="text-blue-600 cursor-pointer pr-2 hover:text-blue-800"
                >
                  Edit
                </button>
                <button onClick={()=>handelDeletes(language.name)} className="text-red-600 cursor-pointer text-lg">{<MdDeleteForever />}</button>
              </section>
            </li>
          ))}
        </ul>
        {/* Show form to edit language name if the language is selected for editing */}
        {lanName != "" && (
          <form onSubmit={handleSubmit(handleSubmitForm)} className="mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Name for {lanName}
              </label>
              <select
                {...register("tobeChanged", { required: "Level is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                <option value="name">Name</option>
                <option value="bio">Bio</option>
                <option value="logo">Logo</option>
              </select>
              {errors.tobeChanged && (
                <p className="text-red-500 text-sm">
                  {errors.tobeChanged.message}
                </p>
              )}
              <input
                {...register("newData", {
                  required: "this feild is required",
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter here"
              />
              {errors.newData && (
                <p className="text-red-500 text-sm">{errors.newData.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 mt-4 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Language
            </button>
          </form>
        )}
      </div>
      {/* Toggle visibility of the Add Language Section */}
      <section
        onClick={handelBtnClick}
        className="flex items-center border p-4 rounded-sm justify-between cursor-pointer"
      >
        <label>Add Language:</label>
        <button className="text-xl">
          <IoMdArrowDropright />
        </button>
      </section>

      {/* Conditionally render content based on isOn */}
      {isOn && (
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-4">
            {formMode === "add" ? "Add New Language" : "Edit Language"}
          </h2>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Language Name:
              </label>
              <input
                {...register("name", { required: "Language name is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter language name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
              <label className="block text-sm font-medium mb-2">
                Language logo link:
              </label>
              <input
                {...register("logo", { required: "Language name is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the link for the logo"
              />
              {errors.logo && (
                <p className="text-red-500 text-sm">{errors.logo.message}</p>
              )}
              <label className="block text-sm font-medium mb-2">
                Language bio:
              </label>
              <input
                {...register("bio", { required: "Language name is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter language name"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formMode === "add" ? "Add Language" : "Update Language"}
            </button>
          </form>
        </div>
      )}

      {/* Language Dropdown */}
      <div className="my-6">
        <h1 className="text-center p-4 md:text-2xl mb-2 font-medium">
          Topice Update/Delete
        </h1>
        <select
          value={data.selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full p-4 border-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a language</option>
          {data.languages.map((language) => (
            <option key={language._id} value={language.name}>
              {language.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons: Edit or Add Topic */}
      <div className="md:flex grid grid-cols-2 items-center gap-2 justify-around space-x-4 mb-6">
        <button
          onClick={() =>
            data.selectedLanguage != ""
              ? setFormMode("edit")
              : alert("please select a language")
          }
          className="bg-green-900 rounded-xl md:p-4  md:max-w-full hover:translate-1 hover:bg-green-800 font-semibold text-lg text-white p-2 w-full"
        >
          Edit topic
        </button>
        <button
          onClick={() =>
            data.selectedLanguage != ""
              ? setFormMode("add")
              : alert("please select a language")
          }
          className="bg-blue-900 rounded-xl md:p-4 md:max-w-full hover:translate-1 hover:bg-blue-800 font-semibold text-lg text-white p-2 w-full"
        >
          Add topic
        </button>
        <button
          onClick={() =>
            data.selectedLanguage != ""
              ? setFormMode("delete")
              : alert("please select a language")
          }
          className="bg-red-800 rounded-xl col-span-2 md:p-4  md:max-w-full hover:translate-1 hover:bg-red-700 font-semibold text-lg text-white p-2 w-full"
        >
          Delete topic
        </button>
      </div>

      {/* Topic Selection Dropdown (only shown when editing) */}
      {formMode === "edit" && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Topic to Update:
          </label>
          <select
            value={data.selectedTopic}
            onChange={handleTopicChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a topic</option>
            {data.topics.map((t) => (
              <option key={t.title} value={t.title}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      )}
      {formMode === "delete" && (
        <div className="h-screen w-screen bg-white fixed top-0 left-0 z-50 flex justify-center items-center">
          {/* Close Button */}
          <button
            onClick={() => {
              setFormMode("view");
            }}
            className="absolute top-2 right-2 text-xl p-2"
          >
            <CgClose />
          </button>

          {/* Delete Modal */}
          <section className="flex flex-col bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h1 className="text-2xl text-center font-semibold mb-4">
              Delete Topics
            </h1>
            <p className="mb-6 text-red-900">
              Are you sure you want to delete a topic? This action cannot be
              undone.
            </p>

            <ul className="flex flex-col w-full p-5 shadow-xl rounded-lg">
              {data.topics.map((t) => (
                <li
                  key={t._id}
                  className="flex justify-between items-center mb-3 p-3 bg-white rounded-md border hover:bg-amber-200"
                >
                  <span>{t.title}</span>

                  {/* Delete Button for each topic */}
                  <button
                    onClick={() => handleDeleteTopic(t._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <CgClose />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* Add or Edit Topic Form */}
      <div className="space-y-6">
        {(formMode === "add" || formMode === "edit") && (
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <h2 className="text-xl font-semibold mb-4">
              {formMode === "add" ? "Add New Topic" : "Update Topic"}
            </h2>

            {/* Form Fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Topic Title:
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter topic title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bio:</label>
              <textarea
                {...register("bio", { required: "Bio is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bio"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Details:</label>
              <textarea
                {...register("details", { required: "Details are required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter details"
              />
              {errors.details && (
                <p className="text-red-500 text-sm">{errors.details.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Level:</label>
              <select
                {...register("level", { required: "Level is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.level && (
                <p className="text-red-500 text-sm">{errors.level.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formMode === "add" ? "Add Topic" : "Update Topic"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Admin;
