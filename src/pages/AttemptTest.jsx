import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const AttemptTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ✅ Fetch test and questions
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        setTest(data);
        setQuestions(data.questions);
        setTimeLeft(data.duration * 60);

        // Initialize status (not visited by default)
        const initStatus = {};
        data.questions.forEach((q) => (initStatus[q._id] = "not-visited"));
        setStatus(initStatus);

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching test:", err);
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // ✅ Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ✅ Handle selection
  const handleSelect = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
    setStatus({ ...status, [qId]: "answered" });
  };

  // ✅ Mark for review
  const handleMarkForReview = (qId) => {
    setStatus({ ...status, [qId]: "review" });
  };

  // ✅ Clear response
  const handleClearResponse = (qId) => {
    const newAnswers = { ...answers };
    delete newAnswers[qId];
    setAnswers(newAnswers);
    setStatus({ ...status, [qId]: "not-answered" });
  };

  // ✅ Navigation
  const handleNext = () => {
    const currentQ = questions[activeQuestion];
    if (status[currentQ._id] === "not-visited") {
      setStatus({ ...status, [currentQ._id]: "not-answered" });
    }
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion(activeQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (activeQuestion > 0) setActiveQuestion(activeQuestion - 1);
  };

  // ✅ Confirm submit modal
  const handleConfirmSubmit = () => setShowConfirmModal(true);
  const handleCancelSubmit = () => setShowConfirmModal(false);

  // ✅ Submit answers
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = { testId: id, answers };
      await api.post(`/attempts/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Test submitted successfully!");
      navigate("/results");
    } catch (err) {
      console.error("❌ Error submitting test:", err);
      alert("❌ Submission failed, please try again.");
    }
  };

  // ✅ Auto-submit when time ends
  const handleAutoSubmit = () => {
    alert("⏰ Time is up! Submitting your test automatically...");
    handleSubmit();
  };

  if (loading)
    return <p className="p-6 text-gray-600">Loading test, please wait...</p>;

  const currentQ = questions[activeQuestion];

  // ✅ Get color for palette buttons
  const getColor = (q) => {
    switch (status[q._id]) {
      case "answered":
        return "bg-green-500 text-white";
      case "not-answered":
        return "bg-red-500 text-white";
      case "review":
        return "bg-purple-500 text-white";
      case "not-visited":
      default:
        return "bg-gray-300";
    }
  };

  // ✅ Summary for submit modal
  const summary = {
    total: questions.length,
    answered: Object.values(status).filter((v) => v === "answered").length,
    review: Object.values(status).filter((v) => v === "review").length,
    notAnswered: Object.values(status).filter((v) => v === "not-answered").length,
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-gray-50 min-h-screen">
      {/* 🧠 Question Area */}
      <div className="lg:col-span-3 bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">{test?.title}</h2>
          <span className="text-lg font-semibold text-red-500">
            ⏰ {formatTime(timeLeft)}
          </span>
        </div>

        {currentQ && (
          <>
            <h3 className="text-lg font-semibold mb-3">
              Q{activeQuestion + 1}. {currentQ.question}
            </h3>

            <div className="space-y-2">
              {currentQ.options.map((opt, i) => (
                <label
                  key={i}
                  className={`block border p-2 rounded cursor-pointer transition ${
                    answers[currentQ._id] === opt
                      ? "bg-blue-100 border-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQ._id}`}
                    value={opt}
                    checked={answers[currentQ._id] === opt}
                    onChange={() => handleSelect(currentQ._id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-between mt-6 gap-2">
              <button
                onClick={() => handleClearResponse(currentQ._id)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Clear Response
              </button>
              <button
                onClick={() => handleMarkForReview(currentQ._id)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Mark for Review
              </button>
              <button
                onClick={handlePrev}
                disabled={activeQuestion === 0}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save & Next
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Test
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🧩 Question Palette */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-center text-blue-600">
          Question Palette
        </h3>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
          {questions.map((q, i) => (
            <button
              key={q._id}
              onClick={() => setActiveQuestion(i)}
              className={`w-10 h-10 rounded-full text-sm font-semibold ${getColor(
                q
              )}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="border-t pt-3 text-sm space-y-1">
          <p>
            <span className="inline-block w-4 h-4 bg-gray-300 rounded mr-2"></span>
            Not Visited
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span>
            Not Answered
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>
            Answered
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-purple-500 rounded mr-2"></span>
            Marked for Review
          </p>
        </div>
      </div>

      {/* ✅ Confirm Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Confirm Submission
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to submit? Once submitted, you cannot change
              your answers.
            </p>
            <div className="text-sm text-gray-800 mb-4">
              <p>Total Questions: {summary.total}</p>
              <p>Answered: {summary.answered}</p>
              <p>Not Answered: {summary.notAnswered}</p>
              <p>Marked for Review: {summary.review}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelSubmit}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptTest;
