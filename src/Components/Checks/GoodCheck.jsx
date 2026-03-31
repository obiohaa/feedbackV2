import React, { useEffect } from "react";
import "./check.css";

const CheckMark = ({ onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="checkContainer">
      <svg className="checkSVG" viewBox="0 0 130.2 130.2">
        <circle
          className="path circle"
          fill="none"
          stroke="#73AF55"
          strokeWidth="6"
          cx="65.1"
          cy="65.1"
          r="62.1"
        />
        <polyline
          className="path check"
          fill="none"
          stroke="#73AF55"
          strokeWidth="6"
          strokeLinecap="round"
          points="100.2,40.2 51.5,88.8 29.8,67.5"
        />
      </svg>

      <p className="success">
        Thank you for taking your time to share your feedback. Your input helps us serve you better.
      </p>

      <button className="ok-btn" onClick={onClose} autoFocus>
        OK
      </button>
    </div>
  );
};

export default CheckMark;
