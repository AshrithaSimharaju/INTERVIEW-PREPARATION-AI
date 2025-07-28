import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Signup";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/interviewPrep";
import { UserProvider } from "./context/userContext"; // ✅ If you're using user context
import TestQuestions from './pages/TestQuestions';
const App = () => {
  return (
    <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
            <Route path="/test-questions" element={<TestQuestions />} />
          <Route path="/dashboard" element={<Dashboard />} />
<Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />




        </Routes>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
    </UserProvider>
  );
};

export default App;
