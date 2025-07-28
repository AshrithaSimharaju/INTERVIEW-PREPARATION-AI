import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaRegCopy,
  FaThumbtack,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "../../components/layouts/Navbar";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [visibleQuestions, setVisibleQuestions] = useState(5);
  const [loading, setLoading] = useState(true);
  const [pinnedQuestions, setPinnedQuestions] = useState([]);
  const [expandedAnswers, setExpandedAnswers] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [explanations, setExplanations] = useState({});

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if (res.data?.session?.questions?.length) {
        const questionsWithAnswers = res.data.session.questions.filter((q) => q.answer?.trim());
        setSessionData({ ...res.data.session, questions: questionsWithAnswers });
      } else {
        toast.error("No questions with answers found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load session.");
    } finally {
      setLoading(false);
    }
  };

  const togglePin = (id) => {
    setPinnedQuestions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [id, ...prev]
    );
  };

  const toggleAnswer = (id) => {
    setExpandedAnswers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied code to clipboard!");
  };

  const fetchExplanation = async (questionId, question) => {
    setExplanations((prev) => ({ ...prev, [questionId]: "Loading explanation..." }));
    setSelectedQuestion(question);
    try {
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLAINATION, { question });
      const raw = res.data.explanation || "";
      const match = raw.match(/"explanation"\s*:\s*"([\s\S]*?)"\s*}$/);
      const cleanText = match
        ? match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"')
        : raw.replace(/"title"\s*:\s*".*?",?/, "").replace(/"explanation"\s*:\s*"/, "").replace(/"}$/, "");
      setExplanations((prev) => ({ ...prev, [questionId]: cleanText }));
    } catch (err) {
      setExplanations((prev) => ({ ...prev, [questionId]: "Failed to fetch explanation." }));
    }
  };

  const renderWithCodeHighlight = (text) => {
    return text.split(/(```[a-zA-Z]*\n[\s\S]*?```|`[^`]+`)/g).map((part, i) => {
      if (/^```[a-zA-Z]*\n[\s\S]*```$/.test(part)) {
        const code = part.replace(/```[a-zA-Z]*\n/, "").replace(/```$/, "");
        return (
          <div
            key={i}
            className="relative bg-blue-50 border border-blue-300 rounded-lg my-2"
          >
            <pre className="overflow-x-auto text-xs text-gray-800 p-3">
              <code>{code}</code>
            </pre>
            <button
              onClick={() => handleCopyCode(code)}
              className="absolute top-1 right-2 text-gray-500 hover:text-black text-sm"
            >
              <FaRegCopy />
            </button>
          </div>
        );
      } else if (/^`[^`]+`$/.test(part)) {
        const inlineCode = part.replace(/`/g, "");
        return (
          <code
            key={i}
            className="bg-blue-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono"
          >
            {inlineCode}
          </code>
        );
      } else {
        return <p key={i} className="mb-1 whitespace-pre-wrap">{part}</p>;
      }
    });
  };

  const questionsToShow = () => {
    if (!sessionData?.questions) return [];
    const pinned = sessionData.questions.filter((q) => pinnedQuestions.includes(q._id));
    const rest = sessionData.questions.filter((q) => !pinnedQuestions.includes(q._id));
    return [...pinned, ...rest].slice(0, visibleQuestions);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!sessionData || !sessionData.questions.length) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center text-gray-600">
          No questions with answers found.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex pt-20">
        <div className="w-full md:w-3/4 mx-auto p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Interview Prep</h1>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">{sessionData.role}</h2>
            <p className="text-sm text-gray-600 mb-1">Experience: {sessionData.experience}</p>
            <p className="text-sm text-gray-600 mb-1">Topics: {sessionData.topicsToFocus}</p>
            <p className="text-sm text-gray-600">{sessionData.description}</p>
          </div>

          {questionsToShow().map((q, idx) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-4 mb-4 border relative"
            >
              <div className="flex justify-between items-start">
                <div className="text-base font-medium text-gray-800">
                  {idx + 1}. {q.question}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => togglePin(q._id)} title="Pin">
                    <FaThumbtack
                      className={`text-xl hover:scale-110 transition ${
                        pinnedQuestions.includes(q._id)
                          ? "text-red-600 rotate-45"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <button onClick={() => toggleAnswer(q._id)}>
                    {expandedAnswers.includes(q._id) ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedAnswers.includes(q._id) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-gray-700 bg-gray-50 p-3 rounded-md border"
                  >
                    <div className="whitespace-pre-wrap text-sm text-gray-800">
                      {renderWithCodeHighlight(q.answer)}
                    </div>
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => fetchExplanation(q._id, q.question)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Learn More →
                      </button>
                    </div>
                    {explanations[q._id] && (
                      <div className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
                        {renderWithCodeHighlight(explanations[q._id])}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {visibleQuestions < sessionData.questions.length && (
            <button
              onClick={() => setVisibleQuestions(visibleQuestions + 5)}
              className="px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default InterviewPrep;
