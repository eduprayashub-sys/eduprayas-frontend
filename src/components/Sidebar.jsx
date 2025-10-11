import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, BarChart, UserCircle, Mail } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation(); // ✅ Needed for active link detection

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:static lg:translate-x-0 bg-white w-64 h-full shadow-md transition-transform duration-300 z-40`}
    >
      {/* Logo / Brand */}
      <div className="p-4 text-2xl font-bold text-blue-600 text-center border-b">
        Eduprayas
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 font-medium rounded-l-full ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Home className="mr-2" size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 font-medium rounded-l-full ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Users className="mr-2" size={18} /> Users
        </NavLink>

        <NavLink
          to="/admin/tests"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 font-medium rounded-l-full ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FileText className="mr-2" size={18} /> Tests
        </NavLink>

        <NavLink
          to="/admin/results"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 font-medium rounded-l-full ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <BarChart className="mr-2" size={18} /> Results
        </NavLink>

        {/* 📩 Messages Link */}
        <NavLink
          to="/admin/messages"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 font-medium rounded-l-full ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Mail className="mr-2" size={18} /> Messages
        </NavLink>

        {/* 👤 Profile Link */}
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 font-medium rounded-l-full ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <UserCircle className="mr-2" size={18} /> Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
