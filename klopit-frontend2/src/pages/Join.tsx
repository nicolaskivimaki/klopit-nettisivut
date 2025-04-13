// src/pages/Join.tsx
import React from "react";
import BackgroundImage from "../components/BackgroundImage";
import joinBg from "../assets/jäsenyys_kuva2.jpeg";
import TextBlock from "../components/TextBlock";

const benefits = [
  "Pääset osallistumaan seinäjokisen kannattajakulttuurin edistämiseen.",
  "Katsomokoreografioiden ja -materiaalien mahdollistaminen.",
  "Alennetut jäsenhinnat yhdistyksen järjestämistä matkoista vieraspeleihin, sekä yhdistyksen kannattajatuotteista (t-paidat, huivit, hupparit jne.).",
  "Oikeus osallistua yhdistyksen järjestämiin tapahtumiin ja virkistysiltoihin.",
  "Vastaamismahdollisuus vain jäsenille tarkoitettuihin kyselyihin ja siten yhdistyksen toimintaan vaikuttaminen.",
  "Oikeus mahdollisten yhteistyökumppaneiden kanssa sovittaviin etuihin.",
  "Läsnäolo- ja äänestysoikeus yhdistyksen vuosikokouksessa.",
];

// Rename to PascalCase and define as a proper component
const Instructions: React.FC = () => {
  return (
    <div className="donations">
      <div className="donations-content">
        <h2>Liittymisohje Meidän Kerho ry:n jäseneksi</h2>
        <div className="donation-card">
          <ul>
            <li>
              <strong>Jäseneksi voit liittyä laittamalla viestiä:</strong>{" "}
              posti@meidankerho.fi
            </li>
            <li>
              <strong>Aiheeksi:</strong> "jäsentiedot"
            </li>
            <li>
              <strong>Viestiin tulee sisällyttää:</strong>
              <ul>
                <li>- Etu- ja sukunimi</li>
                <li>- Sähköpostiosoite</li>
                <li>- Puhelinnumero</li>
              </ul>
            </li>
            <li>
              <strong>Maksa jäsenmaksu 25€ (vuosittainen 15€ +
              liittymismaksu 10€) tilille:</strong>
            </li>
            <li>
              FI29 4108 0013 1821 60
            </li>
            <li>
              <strong>Maksunsaajaksi:</strong> Meidän Kerho ry
            </li>
            <li>
            <strong>Ei viitettä. Kirjoita viestikenttään:{" "}</strong>
              "Liittyminen24 etu- ja sukunimi"
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Join: React.FC = () => (
  <>
    <BackgroundImage
      image={joinBg}
      title="Jäsenyys"
      description=""
      variant="default"
    />
    <div className="container page-content">
      <div className="component-wrapper">
        <TextBlock
          heading="Jäsenyyden edut"
          content="Kloppien jäsenenä pääset nauttimaan muun muassa seuraavista jäseneduista:"
          list={benefits}
        />
      </div>
      <div className="component-wrapper">
        <Instructions /> {/* Render the component properly */}
      </div>
    </div>
  </>
);

export default Join;