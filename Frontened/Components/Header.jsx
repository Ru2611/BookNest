import React from "react";
import Logo from "./Book_logo.png";
import NavBar from "./Nav";


const Header = () => {
  return (
    <div className="navBar">
      <div className="logoCircle">
        <img src={Logo} alt="BookNest" />
      </div>

      <div className="titleBox">
        <h1 className="title">BookNest</h1>
        <p className="tagline">Your Cozy Corner for Books</p>
      </div>

      <NavBar />
    </div>
  );
};

export default Header;
