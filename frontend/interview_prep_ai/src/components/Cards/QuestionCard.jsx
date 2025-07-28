import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronDown, LuChevronUp, LuPin, LuPinOff, LuLightbulb } from "react-icons/lu";

const QuestionCard = ({
  question,
  isPinned,
  onPinToggle,
  onLearnMore,
  explanation,
  isLoadingExplain
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white border p-4 rounded-xl shadow mb-4 transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{question.question}</h2>
        </div>
        <div className="flex flex-col gap-2 items-end ml-4">
          <button onClick={onPinToggle} className="text-gray-500 hover:text-yellow-500">
            {isPinned ? <LuPinOff size={20} /> : <LuPin size={20} />}
          </button>
          <button onClick={() => setShowAnswer(!showAnswer)} className="text-gray-500 hover:text-blue-500">
            {showAnswer ? <LuChevronUp size={20} /> : <LuChevronDown size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            <p className="text-gray-700">{question.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3">
        <button
          onClick={onLearnMore}
          disabled={isLoadingExplain}
          className="text-blue-600 text-sm hover:underline"
        >
          {isLoadingExplain ? "Loading..." : "Learn More"}
        </button>

        {Array.isArray(explanation) && (
          <ul className="mt-3 bg-blue-50 text-blue-800 text-sm p-3 rounded-md list-disc list-inside space-y-1">
            {explanation.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
