import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { api_url } from "../helper";
import { toast } from "react-toastify";

//import API from "../axiosConfig.js";
//import axios from "axios";
const Register = () => {
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {

    e.preventDefault();
    fetch(api_url + "/users/register", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    }).then((res) => {
        if (res.headers.get("content-type")?.includes("application/json")) {
          return res.json();
        }
        throw new Error("Unexpected response format");
      }).then((data) => {
        console.log("Registered :", data);
        
        if(data.success) {
          console.log("Navigating to...");
          
          navigate("/login");
        } else {
          toast.error(data.error );
        }
      }).catch((err) => {
        console.log(err)
        console.error("Fetch Error:", err);
        toast.error(err.message || "An unexpected error occurred");
      });
    // Debug: Log formData before submission
    // console.log("Form Data Submitted:", formData);

    // // Validate form fields
    // if (!formData.username || !formData.email || !formData.password) {
    //   setMessage("All fields are required.");
    //   return;
    // }

    // try {
    //   const response = await axios({url: "http://localhost:8080/api/users/register",
    //         method: "POST"}, formData);
    //   console.log("API Response:", response.data); // Debug: Log success response
    //   setMessage("Registration successful! Please login.");
    // } catch (error) {
    //   console.error("API Error:", error.response || error.message); // Debug: Log error
    //   setMessage(error.response?.data?.message || "Something went wrong.");
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="username">
              Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-4">
          Already a user?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
