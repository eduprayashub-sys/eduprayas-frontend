import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">About Eduprayas</h2>
          <p className="text-sm leading-6">
            Eduprayas is an online education platform providing mock tests, 
            MCQs, and study materials to help students prepare for competitive exams effectively.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/home"
                className="hover:text-blue-400 transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/tests"
                className="hover:text-blue-400 transition duration-200"
              >
                Tests
              </Link>
            </li>
            <li>
              <Link
                to="/results"
                className="hover:text-blue-400 transition duration-200"
              >
                Results
              </Link>
            </li>
            <li>
              <Link
                to="/questions"
                className="hover:text-blue-400 transition duration-200"
              >
                Question Bank
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Contact Us</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              <a
                href="mailto:eduprayashub@gmail.com"
                className="hover:text-blue-400"
              >
                eduprayashub@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-400" />
              <a href="tel:+918888888888" className="hover:text-blue-400">
                +91 88888 88888
              </a>
            </li>
          </ul>
        </div>

        {/* Policies & Social Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Useful Links</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/about"
                className="hover:text-blue-400 transition duration-200"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-blue-400 transition duration-200"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-blue-400 transition duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Social Media */}
          <div className="flex space-x-4 mt-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-sky-400 transition"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition"
            >
              <FaInstagram size={18} />
            </a>
            
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Eduprayas. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
