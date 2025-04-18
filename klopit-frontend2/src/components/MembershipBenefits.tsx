// src/components/MembershipBenefits.tsx
import React from "react";
import { Link } from "react-router-dom";
import membershipImage from "../assets/jasenyys_kuva1.jpg";

const MembershipBenefits: React.FC = () => {
  const benefitsDescription =
    "Meidän Kerho ry:n jäsenenä tuet kannattajakulttuurin kasvua, pääset vaikuttamaan kannattajaryhmän toimintaan, sekä saat alennuksia matkoista, tuotteista ja tapahtumista. Lue lisää ja liity nyt!";

  return (
    <div className="membership-benefits">
      <div className="membership-content">
        <div className="membership-text">
          <h2>Jäsenyyden edut</h2>
          <p>{benefitsDescription}</p>
          <Link to="/join" className="btn btn-primary">
            Lue lisää
          </Link>
        </div>
        <div className="membership-image">
          <img src={membershipImage} alt="Membership Benefits" />
        </div>
      </div>
    </div>
  );
};

export default MembershipBenefits;