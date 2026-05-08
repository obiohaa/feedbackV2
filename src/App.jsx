import React from "react";
import SetUp from "./Components/Setup/Index";
import FeedbackForm from "./Components/Main/FeedbackForm";
import ErrorPage from "./Components/Error/ErrorPage";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/feedbackSetup" element={<SetUp />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
