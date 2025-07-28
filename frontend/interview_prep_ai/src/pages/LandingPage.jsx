import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { APP_FEATURES } from "../utils/data";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";


const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      alert("Please log in or sign up to continue");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-white flex flex-col">
      
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center px-8 py-6">
        <h1 className="text-xl sm:text-2xl font-bold text-orange-600">
          Interview Prep AI
        </h1>
        {user ? (
          <ProfileInfoCard />
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-white text-orange-500 border border-orange-400 rounded-md shadow hover:bg-orange-50 transition font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition font-medium"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-12">
        <span className="inline-block bg-yellow-200 text-orange-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
          🚀 AI Powered
        </span>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Ace Interviews with <br />
          <span className="text-orange-500">AI-Powered</span> Learning
        </h2>

        <p className="mt-5 text-gray-700 text-lg max-w-xl">
          Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize your prep your way.
        </p>

        <button
          onClick={handleCTA}
          className="mt-8 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-lg font-semibold shadow-lg"
        >
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <section className="w-full bg-[#FFFCEF] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-12">
            Features That Make You Shine
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {APP_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="bg-[#FFFEF8] p-6 rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
