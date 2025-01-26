// src/components/MembershipBenefits.tsx
import React from "react";
import { Link } from "react-router-dom";
import membershipImage from "../assets/jäsenyys_kuva1.png"; // Add your image here

const MembershipBenefits: React.FC = () => {
    const benefitsDescription = 
      "Kloppien jäsenenä tuet kannattajakulttuurin kasvua, pääset vaikuttamaan kannattajaryhmän toimintaan, sekä saat alennuksia matkoista, tuotteista ja tapahtumista. Lue lisää ja liity nyt!";
  
    return (
      <div className="membership-benefits">
        <div className="membership-content">
          {/* Left side: Title and Benefits */}
          <div className="membership-text">
            <h2>Jäsenyyden edut</h2>
            <p>{benefitsDescription}</p>
            <Link to="/join" className="join-button">
              Lue lisää
            </Link>
          </div>
  
          {/* Right side: Image */}
          <div className="membership-image">
            <img src={membershipImage} alt="Membership Benefits" />
          </div>
        </div>
      </div>
    );
  };
  
export default MembershipBenefits;
  