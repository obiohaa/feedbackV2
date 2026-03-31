import React from "react";
import "./component.css";
import SetUp from "./SetUp";
import { ToastContainer } from "react-toastify";

const Index = () => {
  return (
    <div>
      <ToastContainer />
      <SetUp />
    </div>
  );
};

export default Index;
