import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-40">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Eduprayas Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-blue-600">Eduprayas</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 font-medium text-gray-700">
          <li>
            <Link
              to="/home"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </Link>
          </li>

          <li className="relative group">
            <button className="hover:text-blue-600 transition-colors duration-200">
              Question Bank ▾
            </button>
            <div className="absolute hidden group-hover:block bg-white border rounded-md shadow-md mt-2 w-48">
              <Link
                to="/questions?subject=gk"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                General Knowledge
              </Link>
              <Link
                to="/questions?subject=math"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                Mathematics
              </Link>
              <Link
                to="/questions?subject=english"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                English
              </Link>
            </div>
          </li>

          <li className="relative group">
            <button className="hover:text-blue-600 transition-colors duration-200">
              MCQ Test ▾
            </button>
            <div className="absolute hidden group-hover:block bg-white border rounded-md shadow-md mt-2 w-48">
              <Link
                to="/tests"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                Start Test
              </Link>
              <Link
                to="/results"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                My Results
              </Link>
            </div>
          </li>

          <li className="relative group">
            <button className="hover:text-blue-600 transition-colors duration-200">
              Practice Test ▾
            </button>
            <div className="absolute hidden group-hover:block bg-white border rounded-md shadow-md mt-2 w-48">
              <Link
                to="/tests?category=practice"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                Practice GK
              </Link>
              <Link
                to="/tests?category=aptitude"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                Aptitude Test
              </Link>
            </div>
          </li>

          <li className="relative group">
            <button className="hover:text-blue-600 transition-colors duration-200">
              Exams ▾
            </button>
            <div className="absolute hidden group-hover:block bg-white border rounded-md shadow-md mt-2 w-48">
              <Link
                to="/tests?exam=ssc"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                SSC Exams
              </Link>
              <Link
                to="/tests?exam=bank"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                Bank Exams
              </Link>
              <Link
                to="/tests?exam=railway"
                className="block px-4 py-2 hover:bg-blue-50"
              >
                Railway Exams
              </Link>
            </div>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none text-gray-700"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <ul className="flex flex-col text-gray-700 font-medium">
            <Link to="/home" className="px-4 py-2 hover:bg-blue-50">
              Home
            </Link>
            <Link to="/tests" className="px-4 py-2 hover:bg-blue-50">
              Tests
            </Link>
            <Link to="/results" className="px-4 py-2 hover:bg-blue-50">
              Results
            </Link>
            <Link to="/questions" className="px-4 py-2 hover:bg-blue-50">
              Question Bank
            </Link>
            <button
              onClick={handleLogout}
              className="text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
