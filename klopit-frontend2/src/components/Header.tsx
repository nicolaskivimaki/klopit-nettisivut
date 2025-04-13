import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/klopit_logo.png";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false); // Ensure menu closes on logout
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Use functional update for reliable state toggle
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Explicitly close the menu
  };

  useEffect(() => {
    setIsMenuOpen(false); // Close menu on route change
  }, [location.pathname]); // Use location.pathname to avoid unnecessary triggers

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.min(scrollY / 30, 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerStyle = {
    backgroundColor: `rgba(0, 0, 0, ${scrollOpacity})`,
    transition: "background-color 0.3s",
  };

  const isActive = (path: string) => (location.pathname === path ? "active" : "");

  return (
    <header className="header" style={headerStyle}>
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="Meidän Kerho logo" className="logo-img" />
        </Link>
        <button className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" className={`nav-link ${isActive("/")}`} onClick={closeMenu}>
            Koti
          </Link>
          <Link to="/about" className={`nav-link ${isActive("/about")}`} onClick={closeMenu}>
            Meistä
          </Link>
          <Link to="/join" className={`nav-link ${isActive("/join")}`} onClick={closeMenu}>
            Jäsenyys
          </Link>
          <Link to="/events" className={`nav-link ${isActive("/events")}`} onClick={closeMenu}>
            Tapahtumat
          </Link>
          <Link
            to="/chants"
            className={`nav-link ${isActive("/chants")}`} // Fixed: Added isActive
            onClick={closeMenu} // Added: Close menu on click
          >
            Chants
          </Link>
          {user && (
            <button onClick={handleLogout} className="btn btn-primary logout-button">
              Kirjaudu ulos
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;