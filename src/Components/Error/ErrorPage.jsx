// import React from "react";
import "./ErrorPage.css";
import { Link } from "react-router-dom";

const ErrorPage = ({ status, msg, altMessage }) => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>{status ? status : "404"}</h1>
        </div>
        <h2>{msg ? msg : "Something Went Wrong!"}</h2>
        <p>{altMessage ? altMessage : "Don't panic, Please click on the Feedback Button "}</p>
        <Link to="/" className="signUpButton">
          FEEDBACK
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
