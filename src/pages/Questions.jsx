import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Questions = () => {
  const [tests, setTests] = useState([]);
  const [questionsByTest, setQuestionsByTest] = useState({});
  const [form, setForm] = useState({
    testId: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  // ✅ Fetch Tests and Questions
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [testsRes, questionsRes] = await Promise.all([
        api.get("/tests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/questions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setTests(testsRes.data);

      // Group questions by test
      const grouped = {};
      questionsRes.data.forEach((q) => {
        if (!grouped[q.testId?._id]) grouped[q.testId?._id] = [];
        grouped[q.testId?._id].push(q);
      });
      setQuestionsByTest(grouped);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setMessage("❌ Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Handle form input
  const handleChange = (e, index) => {
    if (e.target.name === "option") {
      const newOptions = [...form.options];
      newOptions[index] = e.target.value;
      setForm({ ...form, options: newOptions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ✅ Add or Update Question
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editingId) {
        await api.put(`/questions/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Question updated successfully!");
      } else {
        await api.post("/questions", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Question added successfully!");
      }

      setForm({
        testId: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: "",
      });
      setEditingId(null);
      fetchData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Error saving question:", err);
      setMessage("❌ Failed to save question.");
    }
  };

  // ✅ Edit Question
  const handleEdit = (q) => {
    setEditingId(q._id);
    setForm({
      testId: q.testId?._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete Question
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Question deleted successfully!");
      fetchData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Error deleting question:", err);
      setMessage("❌ Failed to delete question.");
    }
  };

  // ✅ Export Questions to CSV
  const handleExport = () => {
    const allQuestions = [];
    Object.keys(questionsByTest).forEach((testId) => {
      const test = tests.find((t) => t._id === testId);
      questionsByTest[testId].forEach((q) => {
        allQuestions.push({
          TestTitle: test?.title || "Unknown",
          Question: q.question,
          Option1: q.options[0],
          Option2: q.options[1],
          Option3: q.options[2],
          Option4: q.options[3],
          CorrectAnswer: q.correctAnswer,
          Marks: q.marks,
        });
      });
    });

    const csv = Papa.unparse(allQuestions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Eduprayas_Questions.csv");
  };

  // ✅ Import Questions from CSV
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const token = localStorage.getItem("token");
        try {
          const imported = results.data.filter((r) => r.Question && r.CorrectAnswer);
          for (const row of imported) {
            const test = tests.find(
              (t) => t.title.trim().toLowerCase() === row.TestTitle.trim().toLowerCase()
            );
            if (!test) continue;

            const newQuestion = {
              testId: test._id,
              question: row.Question,
              options: [row.Option1, row.Option2, row.Option3, row.Option4],
              correctAnswer: row.CorrectAnswer,
              marks: Number(row.Marks) || 1,
            };

            await api.post("/questions", newQuestion, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }

          setMessage("✅ CSV imported successfully!");
          fetchData();
        } catch (err) {
          console.error("❌ Error importing CSV:", err);
          setMessage("❌ Failed to import CSV.");
        } finally {
          setImporting(false);
          e.target.value = ""; // reset file input
          setTimeout(() => setMessage(""), 3000);
        }
      },
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center justify-between">
        📘 Manage Questions
        <div className="space-x-2">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ⬇️ Export CSV
          </button>
          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            📤 Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
              disabled={importing}
            />
          </label>
        </div>
      </h2>

      {message && (
        <div className="mb-4 text-center bg-blue-500 text-white py-2 rounded">
          {message}
        </div>
      )}

      {/* ✅ Add/Edit Form and Question Table remain same */}
    </div>
  );
};

export default Questions;
