import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    tests: 0,
    questions: 0,
    results: 0,
    myTests: 0,
    avgScore: 0,
    bestScore: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const email = decoded.email;
        setIsAdmin(email === "eduprayashub@gmail.com");

        const headers = { Authorization: `Bearer ${token}` };

        // ✅ API call using base URL from .env
        const res = await api.get("/admin/stats", { headers });

        setStats(res.data.stats || {});
        setChartData(res.data.activity || []);
      } catch (error) {
        console.error("❌ Dashboard fetch error:", error);
      }
    };
    fetchData();
  }, []);
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        {isAdmin ? "Admin Dashboard Overview" : "Student Performance Dashboard"}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isAdmin ? (
          <>
            <Card title="Total Users" value={stats.users} color="blue" />
            <Card title="Total Tests" value={stats.tests} color="green" />
            <Card title="Total Questions" value={stats.questions} color="yellow" />
            <Card title="Results Submitted" value={stats.results} color="red" />
          </>
        ) : (
          <>
            <Card title="Tests Attempted" value={stats.myTests} color="blue" />
            <Card title="Average Score (%)" value={stats.avgScore} color="green" />
            <Card title="Best Score (%)" value={stats.bestScore} color="yellow" />
            <Card title="Total Available Tests" value={stats.tests} color="red" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isAdmin ? (
          <>
            {/* Admin: User Signups */}
            <ChartCard title="Daily User Signups">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Admin: Test Attempts */}
            <ChartCard title="Daily Test Attempts">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tests" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        ) : (
          <>
            {/* Student: Test History */}
            <ChartCard title="My Performance Over Time">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="percentage" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Student: Attempted Tests */}
            <ChartCard title="Tests Attempted per Day">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tests" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// 🧩 Reusable Components
const Card = ({ title, value, color }) => {
  const colors = {
    blue: "border-blue-600 text-blue-700",
    green: "border-green-600 text-green-700",
    yellow: "border-yellow-500 text-yellow-600",
    red: "border-red-500 text-red-600",
  };
  return (
    <div className={`bg-white p-5 shadow rounded-lg border-t-4 ${colors[color]}`}>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-5 shadow rounded-lg">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);
