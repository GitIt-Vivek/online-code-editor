import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="backdrop-filter border-b border-gray-500 left-0 w-full backdrop-blur-lg h-[60px] bg-opacity-30 sticky top-0 z-10 bg-neutral-100">
      <div className="max-w-full mx-0 px-[50px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-2xl text-gray-900 font-semibold">
            <Link to="/">Logo</Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex justify-between space-x-6 text-gray-950">
            <Link to="/home" className="hover:text-gray-500  transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-gray-500 transition">
              About
            </Link>
            <Link to="/services" className="hover:text-gray-500  transition">
              Services
            </Link>
            <Link to="/contact" className="hover:text-gray-500  transition">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              aria-label="Toggle navigation"
              className="text-gray-900 hover:text-gray-700 transition"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
