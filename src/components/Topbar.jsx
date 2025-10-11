import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, Lock } from "lucide-react";

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userName = localStorage.getItem("name") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      {/* Mobile menu toggle */}
      <button
        className="md:hidden text-gray-600 focus:outline-none"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <h1 className="text-lg font-semibold text-blue-600">Eduprayas Admin Panel</h1>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200"
        >
          <span className="font-medium text-gray-700">{userName}</span>
          <span className="text-gray-500">▼</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 z-20">
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/update-password");
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Lock size={16} className="mr-2 text-blue-500" />
              Update Password
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/profile");
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings size={16} className="mr-2 text-blue-500" />
              Profile
            </button>

            <hr className="my-1" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
