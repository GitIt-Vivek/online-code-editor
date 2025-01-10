import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { PencilLine, Trash2 } from "lucide-react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { api_url } from "../helper";
import { toast } from "react-toastify";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  //const [name, setName] = useState("");
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [editProjectId, setEditProjectId] = useState("")
  const getRunTime = async () => {
    let res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    let data = await res.json();
    const programmingLanguages = ["python", "javascript", "java", "c++", "bash"];
    const options = data
      .filter((runtime) => programmingLanguages.includes(runtime.language))
      .map((runtime) => ({
        label: `${runtime.language} (${runtime.version})`,
        value: runtime.language === "c++" ? "cpp" : runtime.language,
        version: runtime.version,
      }));
    setLanguageOptions(options);
    console.log(options);
  };

  //const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption); // Update selected language state
    console.log("Selected language:", selectedOption);
  };
  
  const createProject = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }
    fetch(api_url + "/snippets/createProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: projectName.trim(),
        language: selectedLanguage?.value || "",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
           const projectVersion = data.version || "1.0.0"; // Default value
           console.log("Project version:", projectVersion);
          setProjectName("");
          navigate("/editor/" + data.projectId);
        } else {
          throw new Error(data.msg || "Failed to create project");
        }
      })
      .catch((error) => {
        console.error("Error creating project:", error.message);
        toast.error(error.message);
      });
      
  };
  const getProjects = async () => {
    fetch(api_url + "/snippets/getProjects", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.projects);
        else toast.error(data.msg || "Failed to get projects");
      });
  }
  const deleteProject = (id) => {
    let conf = confirm("if deleted, it can not be restored")
    if(conf) {
      fetch(api_url + "/snippets/deleteProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          projectId: id,
        }),
      }).then(res => res.json()).then(data => {
        if (data.success) {
          getProjects()
        } else{
          toast.error(data.msg)
        }
      })
    }
  }
  const editProject = (id, newtitle) => {
  // if (!newTitle || newTitle.trim() === "") {
  //   toast.error("Title cannot be empty.");
  //   return;
  // }

  fetch(api_url + "/snippets/editProject", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      projectId: id,
      title: newtitle, // Pass the new title
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        toast.success(data.msg);
        setIsEditModalOpen(false);
        setProjectName(""); // Reset name after successful update
        setEditProjectId(""); // Clear the project ID
        getProjects(); // Refresh projects list
      } else {
        toast.error(data.msg || "Failed to update title");
        setIsEditModalOpen(false);
        setProjectName(""); // Reset name after successful update
        setEditProjectId(""); // Clear the project ID
        getProjects(); // Refresh projects list
      }
    })
    .catch((error) => {
      console.error("Error in editProject route:", error);
      console.error("Error updating project title:", error);
      toast.error("An error occurred while updating the title.");
    });
};

  useEffect(() => {
    getRunTime();
    getProjects([]); // Call function on component mount
  }, []);


  return (
    <>
      <Navbar />
      <div className="flex items-center text-2xl px-[50px] justify-between mt-5">
        <h2>Hello, User</h2>
      </div>
      <div className="projects px-[50px] mt-5  ">
        {projects && projects.length > 0
          ? projects.map((project, index) => {
              return (
                <>
                  <div className="project w-full px-2 py-1 mb-2 rounded-lg flex items-center bg-neutral-100">
                    <div
                      onClick={() => {
                        navigate("/editor/" + project?._id);
                      }}
                      className="flex flex-wrap w-full"
                    >
                      {project.language === "python" ? (
                        <>
                          <img
                            className="w-[30px] h-[30px] object-cover"
                            src="https://images.ctfassets.net/em6l9zw4tzag/oVfiswjNH7DuCb7qGEBPK/b391db3a1d0d3290b96ce7f6aacb32b0/python.png"
                            alt=""
                          />
                        </>
                      ) : project.language === "javascript" ? (
                        <>
                          <img
                            className="w-[30px] h-[30px] object-cover"
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
                            alt=""
                          />
                        </>
                      ) : project.language === "cpp" ? (
                        <>
                          <img
                            className="w-[30px] h-[30px] object-cover"
                            src="https://upload.wikimedia.org/wikipedia/commons/3/32/C%2B%2B_logo.png"
                            alt=""
                          />
                        </>
                      ) : project.language === "c" ? (
                        <>
                          <img
                            className="w-[30px] h-[30px] object-cover"
                            src="https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png"
                            alt=""
                          />
                        </>
                      ) : project.language === "java" ? (
                        <>
                          <img
                            className="w-[30px] h-[30px] object-cover"
                            src="https://static-00.iconduck.com/assets.00/java-icon-1511x2048-6ikx8301.png"
                            alt=""
                          />
                        </>
                      ) : project.language === "bash" ? (
                        <>
                          <img
                            className="w-[30px] h-[30px] object-cover"
                            src="https://w7.pngwing.com/pngs/48/567/png-transparent-bash-shell-script-command-line-interface-z-shell-shell-rectangle-logo-commandline-interface-thumbnail.png"
                            alt=""
                          />
                        </>
                      ) : (
                        ""
                      )}

                      <div className="ml-2">
                        <h3 className="text-xl">{project.title}</h3>
                        <p className="text-[14px] text-[gray]">
                          {project.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap absolute right-16 space-x-4 ">
                      <button
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setEditProjectId(project._id);
                          setProjectName(project.title);
                        }}
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-blue-500"
                      >
                        <PencilLine
                          className="text-black group-hover:text-blue-500"
                          size={20}
                        />
                      </button>
                      <button
                        onClick={() => {
                          deleteProject(project?._id);
                        }}
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-pink-500"
                      >
                        <Trash2
                          className="text-black group-hover:text-pink-500"
                          size={20}
                        />
                      </button>
                    </div>
                  </div>
                </>
              );
            })
          : "No Projects"}
      </div>
      <div className="flex fixed bottom-0 right-0 mb-6 mr-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-4xl h-16 w-16 bg-slate-300 shadow-md text-black  flex justify-center items-center rounded-full transition hover:text-white hover:bg-blue-500 cursor-pointer"
        >
          +
        </button>
      </div>
      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modalContainer")) {
              setIsModalOpen(false);
              setProjectName("");
            }
          }}
          className=" modalContainer fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-[400px]">
            <h2 className="text-xl font-bold mb-4">Add New Project</h2>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="projectName"
              >
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="language"
              >
                Programming Language
              </label>
              <Select
                placeholder="Select a Language"
                options={languageOptions}
                onChange={handleLanguageChange} // Handle language selection
              />

              {selectedLanguage && (
                <>
                  <p className="text-[14px] text-green-500 mt-2">
                    Selected Language: {selectedLanguage.label}
                  </p>
                </>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={createProject}
                  className="px-4 py-2 mt-8 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modalContainer")) {
              setIsEditModalOpen(false);
              setProjectName("");
            }
          }}
          className="modalContainer fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-[400px]">
            <h2 className="text-xl font-bold mb-4">Add New Project</h2>
            <div className="mb-4">
              <h3 className="block text-sm font-medium mb-2">Update Project</h3>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => editProject(editProjectId, projectName)}
                  className="px-4 py-2 mt-8 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {isEditModelShow && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modelCon")) {
              setIsEditModelShow(false);
              setName("");
            }
          }}
          className="modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]"
        >
          <div className="modelBox flex flex-col items-start rounded-xl p-[20px] w-[25vw] h-[auto] bg-[#0F0E0E]">
            <h3 className="text-xl font-bold text-center">Update Project</h3>
            <div className="inputBox">
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                type="text"
                placeholder="Enter your project name"
                className="text-black"
              />
            </div>

            <button
              //onClick={updateProject}
              className="btnNormal bg-blue-500 transition-all hover:bg-blue-600 mt-2"
            >
              Update
            </button>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Home;
/* 
<form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="projectName"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="language"
                >
                  Programming Language
                </label>
                <Select
                  placeholder="Select a Language"
                  options={languageOptions}
                  onChange={handleLanguageChange} // Handle language selection
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
*/
