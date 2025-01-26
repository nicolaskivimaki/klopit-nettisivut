import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/klopit_logo.png";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const location = useLocation();
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.min(scrollY / 30, 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="header"
      style={{ backgroundColor: `rgba(0, 0, 0, ${scrollOpacity})` }}
    >
      <div className="container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="Meidän Kerho logo" className="logo-img" />
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link
            to="/"
            className="nav-link"
            aria-current={location.pathname === "/" ? "page" : undefined}
          >
            Koti
          </Link>
          <Link
            to="/about"
            className="nav-link"
            aria-current={location.pathname === "/about" ? "page" : undefined}
          >
            Meistä
          </Link>
          <Link
            to="/join"
            className="nav-link"
            aria-current={location.pathname === "/join" ? "page" : undefined}
          >
            Jäsenyys
          </Link>
          <Link
            to="/events"
            className="nav-link"
            aria-current={location.pathname === "/events" ? "page" : undefined}
          >
            Tapahtumat
          </Link>
          {user ? (
            <div>
            <span onClick={logout} className="logout-text">
              Kirjaudu ulos
            </span>
          </div>
           ) : (
            <a href="/login">Kirjaudu</a>
           )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
