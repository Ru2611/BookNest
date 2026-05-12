import Container from "react-bootstrap/Container";
import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
// import "../style.css";
import { Link, NavLink } from "react-router-dom";
import { getWishlistIds, subscribeWishlist } from "../lib/wishlist";
import { isLoggedIn, logout, subscribeAuth } from "../lib/auth";

import Login from '../Page/login';
import Signup from '../Page/signup';  // Import Signup component

const NavBar = () => {
  // State to control which form to show
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(() => getWishlistIds().length);
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());

  // Function to close both forms
  const closeForms = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  React.useEffect(
    () => subscribeWishlist(() => setWishlistCount(getWishlistIds().length)),
    []
  );

  React.useEffect(() => subscribeAuth(() => setLoggedIn(isLoggedIn())), []);

  return (
    <div className="NAVBAR">
      <Navbar expand="lg" className="w-100" bg="transparent">
        <Container>
          {/* Header already shows the app name; keep brand only for mobile */}
          <Navbar.Brand as={Link} to="/" className="fw-semibold d-lg-none">
            BookNest
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {loggedIn ? (
                <>
                  <Nav.Link as={NavLink} to="/" end>
                    Home
                  </Nav.Link>

                  <Nav.Link as={NavLink} to="/browse">
                    Browse
                  </Nav.Link>

                  <NavDropdown title="Add Book" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/add?type=sell">
                      Sell
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/add?type=donate">
                      Donate
                    </NavDropdown.Item>
                  </NavDropdown>

                  <Nav.Link as={NavLink} to="/wishlist">
                    Wishlist{" "}
                    {wishlistCount ? (
                      <span className="ms-1 badge rounded-pill bg-dark">
                        {wishlistCount}
                      </span>
                    ) : null}
                  </Nav.Link>
                </>
              ) : null}

              {!loggedIn ? (
                <>
                  {/* LOGIN BUTTON */}
                  <Nav.Link 
                    href="#login" 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLogin(true);
                      setShowSignup(false);  // Hide signup if open
                    }}
                  >
                    Login
                  </Nav.Link>

                  {/* SIGNUP BUTTON */}
                  <Nav.Link 
                    href="#signup" 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSignup(true);
                      setShowLogin(false);  // Hide login if open
                    }}
                    style={{ 
                      backgroundColor: '#28a745', 
                      color: 'white',
                      borderRadius: '4px',
                      padding: '5px 15px',
                      marginLeft: '10px'
                    }}
                  >
                    Sign Up
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  href="#logout"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                    closeForms();
                  }}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#0f172a",
                    color: "white",
                    borderRadius: "4px",
                    padding: "5px 15px",
                  }}
                >
                  Logout
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Show Login Form as Modal/Popup */}
      {showLogin && (
        <div className="modal-overlay" onClick={closeForms}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeForms}>✕</button>
            <Login onSwitchToSignup={() => {
              setShowLogin(false);
              setShowSignup(true);
            }} onSuccess={closeForms} />
          </div>
        </div>
      )}

      {/* Show Signup Form as Modal/Popup */}
      {showSignup && (
        <div className="modal-overlay" onClick={closeForms}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeForms}>✕</button>
            <Signup onSwitchToLogin={() => {
              setShowSignup(false);
              setShowLogin(true);
            }} onSuccess={() => {
              setShowSignup(false);
              setShowLogin(true);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;  
