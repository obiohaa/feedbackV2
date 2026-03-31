import React from "react";
import "./component.css";
import CustomerFeedback from "./FeedbackForm";
import { ToastContainer } from "react-toastify";

const Index = () => {
  return (
    <div>
      <ToastContainer />
      <CustomerFeedback />
    </div>
  );
};

export default Index;
