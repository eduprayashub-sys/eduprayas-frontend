import React, { useEffect, useState } from "react";
import api from "../api/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Results = () => {
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch all results
  const fetchResults = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      console.error("❌ Error fetching results:", err);
    }
  };

  // ✅ Email full report (backend PDF)
  const handleSendReport = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.post(
        "/report/admin/send-report",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "✅ Report email sent successfully!");
    } catch (err) {
      console.error("❌ Error sending report:", err);
      setMessage("❌ Failed to send report email.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // ✅ Download local PDF (frontend)
  const handleDownloadReport = () => {
    if (!results.length) {
      setMessage("⚠️ No results available to export.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(29, 78, 216);
    doc.text("Eduprayas Test Report", 70, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Empowering Education Through Practice", 65, 28);
    doc.line(10, 32, 200, 32);

    const tableData = results.map((r) => [
      r.userId?.name || "N/A",
      r.userId?.email || "N/A",
      r.testId?.title || "N/A",
      `${r.score}/${r.totalMarks}`,
      `${r.percentage}%`,
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    doc.autoTable({
      startY: 40,
      head: [["Student", "Email", "Test", "Score", "Percentage", "Date"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [29, 78, 216], textColor: 255 },
    });

    doc.text(
      "Generated automatically by Eduprayas Admin Panel",
      50,
      doc.internal.pageSize.height - 10
    );

    doc.save("Eduprayas-Admin-Report.pdf");
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">📊 Results</h2>

      {message && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4 text-center font-medium">
          {message}
        </div>
      )}

      {/* ✅ Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mb-4">
        <button
          onClick={handleDownloadReport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬇️ Download PDF Report
        </button>

        <button
          onClick={handleSendReport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📧 Email Full Report
        </button>
      </div>

      {/* ✅ Results Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Student</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Test</th>
              <th className="py-2 px-4 text-center">Score</th>
              <th className="py-2 px-4 text-center">Percentage</th>
              <th className="py-2 px-4 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((r, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{r.userId?.name}</td>
                  <td className="py-2 px-4">{r.userId?.email}</td>
                  <td className="py-2 px-4">{r.testId?.title}</td>
                  <td className="py-2 px-4 text-center">
                    {r.score}/{r.totalMarks}
                  </td>
                  <td className="py-2 px-4 text-center">{r.percentage}%</td>
                  <td className="py-2 px-4 text-center">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
