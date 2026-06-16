import React from "react";
import Logo from "./Book_logo.png";
import NavBar from "./Nav";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="navBar">
      <div className="brand">
        <div className="logoCircle">
          <img src={Logo} alt="BookNest" />
        </div>

        <div className="titleBox">
          <h1 className="title">BookNest</h1>
          <p className="tagline">Your Cozy Corner for Books</p>
        </div>
      </div>
      
      <NavBar />
      <button
        onClick={() => navigate("/login")}
        style={{
          display: "flex", 
          justifyContent: "flex-end",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          background: "#0f172a",
          color: "white",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
    
    
  );
};

export default Header;
