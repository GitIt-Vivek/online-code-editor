import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import "./app.css";
import Editor from './pages/Editor';



function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col  bg-gray-200">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
