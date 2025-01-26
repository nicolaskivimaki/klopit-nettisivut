import React from "react";

const Donations: React.FC = () => {
  return (
    <div className="donations">
      <div className="donations-content">
        <h2>Meidän Kerho ry:n tukeminen</h2>
        <p>
          Jos sinä tai yrityksesi haluatte tukea toimintaamme ilman jäsenyyttä, voitte tehdä
          lahjoituksen näin:
        </p>
        <div className="donation-card">
          <ul>
            <li>
              <strong>Summa:</strong> Syötä haluamasi euromäärä
            </li>
            <li>
              <strong>Saaja:</strong> Meidän Kerho ry
            </li>
            <li>
              <strong>Tili:</strong> FI29 4108 0013 1821 60
            </li>
            <li>
              <strong>Viesti:</strong> Tukimaksu 2025
            </li>
            <li>Viitettä ei tarvitse.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Donations;
