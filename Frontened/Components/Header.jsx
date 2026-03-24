import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Book_logo.png";
import "../styles.css";

const Header = () => {
  return (
    <div className="navBar">
      <Link to="/">
        <img src={Logo} alt="BookNest Logo" />
        <h1>BookNest</h1>
      </Link>
    </div>
  );
};

export default Header;