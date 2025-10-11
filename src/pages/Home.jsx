import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, BarChart2, Users, Award } from "lucide-react";
import api from "../api/axios";

const Home = () => {
  const [stats, setStats] = useState(null);

  // ✅ Optional: Fetch platform analytics (from backend)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.warn("⚠️ Backend not reachable, showing static homepage.");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-yellow-300">Eduprayas</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Your trusted platform for online exams, practice tests, and results tracking.
          </p>
          <Link
            to="/register"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why Choose Eduprayas?
        </h2>

        {/* Optional: dynamic stats if fetched */}
        {stats && (
          <div className="text-center mb-8 text-gray-600">
            <p>
              <strong>{stats.users}</strong> learners |{" "}
              <strong>{stats.tests}</strong> tests |{" "}
              <strong>{stats.questions}</strong> questions |{" "}
              <strong>{stats.results}</strong> results analyzed
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <BookOpen className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Interactive Learning</h3>
            <p className="text-gray-600 text-sm">
              Take tests, analyze results, and learn from your mistakes with detailed insights.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <BarChart2 className="mx-auto text-green-600 w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Performance Tracking</h3>
            <p className="text-gray-600 text-sm">
              Monitor your scores, track improvement trends, and aim for higher accuracy.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <Users className="mx-auto text-purple-600 w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">For Students & Admins</h3>
            <p className="text-gray-600 text-sm">
              Students can attempt tests, while admins manage exams, questions, and users.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <Award className="mx-auto text-yellow-600 w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Get real-time results, scores, and performance breakdowns instantly after tests.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey Today</h2>
          <p className="mb-6 text-blue-100">
            Join Eduprayas and experience smarter exam preparation with live performance insights.
          </p>
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Login Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
