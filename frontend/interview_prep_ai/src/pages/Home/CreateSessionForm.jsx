import React, { useState } from "react";
import Input from "../../components/Inputs/Input";
import { X } from "lucide-react"; // Make sure you have lucide-react installed
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; 
const CreateSessionForm = ({ onCancel }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus,
          numberOfQuestions: 10,
        }
      );
      const generatedQuestions = aiResponse.data.questions;

      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions,
      });

      if (response.data?.session?._id) {
                toast.success("Session created successfully!");
        navigate(`/dashboard`);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-white rounded-xl shadow-md p-6 h-[85vh] flex flex-col justify-between">
      {/* Close (X) Button */}
      <button
        onClick={onCancel}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-center text-gray-800 mb-1">
          Start a New Interview Journey
        </h3>
        <p className="text-sm text-center text-gray-600 mb-3">
          Fill in a few details and unlock your personalized interview questions!
        </p>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto pr-1 mb-4">
        <form className="flex flex-col gap-3 text-sm">
          <Input
            value={formData.role}
            onChange={({ target }) => handleChange("role", target.value)}
            label="Target Role"
            placeHolder="e.g. Frontend Developer"
          />
          <Input
            value={formData.experience}
            onChange={({ target }) => handleChange("experience", target.value)}
            label="Years of Experience"
            placeHolder="e.g. 2 years"
          />
          <Input
            value={formData.topicsToFocus}
            onChange={({ target }) => handleChange("topicsToFocus", target.value)}
            label="Topics to Focus On"
            placeHolder="e.g. React, Node.js"
          />
          <Input
            value={formData.description}
            onChange={({ target }) => handleChange("description", target.value)}
            label="Additional Description"
            placeHolder="Any specific goals or notes?"
          />
        </form>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 text-center mb-2">{error}</p>
      )}

      {/* Footer Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCreateSession}
          className="bg-[#d2691e] hover:bg-[#c75d16] text-white font-semibold py-2 rounded-md text-sm"
        >
          {isLoading ? "Creating..." : "Create Session"}
        </button>
      </div>
    </div>
  );
};

export default CreateSessionForm;






