import Container from "react-bootstrap/Container";
import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
// import "../style.css";
import { Link, NavLink } from "react-router-dom";
import { getWishlistIds, subscribeWishlist } from "../lib/wishlist";
import { isLoggedIn, logout, subscribeAuth } from "../lib/auth";

const NavBar = () => {
  const [wishlistCount, setWishlistCount] = useState(() => getWishlistIds().length);
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());

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
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>

                  <Nav.Link
                    as={NavLink}
                    to="/signup"
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
    </div>
  );
}

export default NavBar;  
