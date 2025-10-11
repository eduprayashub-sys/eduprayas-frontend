import React, { useEffect, useState } from "react";
import api from "../api/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.stats);
        setActivity(res.data.activity || []);
      } catch (err) {
        console.error("❌ Error fetching analytics:", err);
        setMessage("Failed to fetch analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  // ✅ Email full report (backend generated PDF)
  const handleEmailReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/admin/send-report",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "✅ Report emailed successfully!");
    } catch (err) {
      console.error("❌ Error sending report:", err);
      setMessage("Failed to send report email.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  // ✅ Download report (frontend generated PDF)
  const handleDownloadReport = async () => {
    if (!stats) return alert("No data available.");

    const doc = new jsPDF("p", "mm", "a4");

    try {
      // 🖼️ Try to load Eduprayas logo (optional)
      const logoImg = await fetch("/logo.png");
      const blob = await logoImg.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoBase64 = reader.result;

        // 🧾 Header
        doc.addImage(logoBase64, "PNG", 15, 10, 30, 30);
        doc.setFontSize(22);
        doc.setTextColor(29, 78, 216);
        doc.text("Eduprayas Analytics Report", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Comprehensive Admin Report", 105, 28, { align: "center" });

        // 📊 Summary
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("📌 Summary Overview", 14, 50);
        doc.setFontSize(12);
        doc.text(`Total Users: ${stats.users}`, 20, 60);
        doc.text(`Total Tests: ${stats.tests}`, 20, 67);
        doc.text(`Total Questions: ${stats.questions}`, 20, 74);
        doc.text(`Results Submitted: ${stats.results}`, 20, 81);

        // 📅 Activity Table
        if (activity.length > 0) {
          const tableData = activity.map((a) => [
            a.date,
            a.users || 0,
            a.tests || 0,
          ]);

          doc.autoTable({
            startY: 95,
            head: [["Date", "User Signups", "Test Attempts"]],
            body: tableData,
            headStyles: { fillColor: [29, 78, 216] },
          });
        }

        // 🕒 Footer
        const date = new Date().toLocaleDateString();
        const finalY = doc.lastAutoTable?.finalY || 120;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${date}`, 14, finalY + 10);
        doc.text("© 2025 Eduprayas. All rights reserved.", 105, finalY + 20, {
          align: "center",
        });

        // 💾 Save PDF
        doc.save("Eduprayas_Admin_Analytics_Report.pdf");
        setMessage("✅ PDF report downloaded successfully!");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.warn("⚠️ Logo not found, generating text-only report...");
      doc.setFontSize(22);
      doc.setTextColor(29, 78, 216);
      doc.text("Eduprayas Analytics Report", 105, 20, { align: "center" });
      doc.save("Eduprayas_Admin_Analytics_Report.pdf");
    }
  };

  if (loading)
    return <p className="p-6 text-gray-600">Loading report data...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        📑 Eduprayas Reports Center
      </h2>

      {message && (
        <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded">
          {message}
        </div>
      )}

      {stats ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Download or email a complete analytics report including users,
            tests, questions, and results.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadReport}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ⬇️ Download PDF Report
            </button>

            <button
              onClick={handleEmailReport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📧 Email Full Report
            </button>
          </div>
        </div>
      ) : (
        <p>No data available to generate report.</p>
      )}
    </div>
  );
};

export default Reports;
