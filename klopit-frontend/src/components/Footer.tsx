// src/components/Footer.tsx
import React from "react";
import logo from "../assets/klopit_logo.png"; // Adjust the path to your logo image

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={logo} alt="Meidän Kerho logo" className="footer-logo" />
        <p className="footer-title">Meidän Kerho ry</p>
        <p className="footer-contact">posti@meidankerho.fi</p>
      </div>
    </footer>
  );
};

export default Footer;
