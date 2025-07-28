import React, { useState } from 'react';
import axios from 'axios';
import { API_PATHS } from '../utils/apiPaths'; // Make sure this path is correct

const TestQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    try {
      const response = await axios.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: "frontend developer",
        experience: "1 year",
        topicsToFocus: "React, JavaScript",
        numberOfQuestions: 5,
      });

      if (Array.isArray(response.data)) {
        setQuestions(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to fetch questions. See console.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test Interview Question API</h2>
      <button
        onClick={fetchQuestions}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Fetch Questions
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <ul className="mt-6 space-y-3">
        {questions.map((q, index) => (
          <li key={index} className="border p-3 rounded shadow bg-white">
            <strong>Q{index + 1}:</strong> {q.question}
            {q.answer && (
              <p className="text-green-700 mt-2"><strong>Answer:</strong> {q.answer}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestQuestions;
