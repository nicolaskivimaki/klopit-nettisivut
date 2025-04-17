import React from "react";
import BackgroundImage from "../components/BackgroundImage";
import joinBg from "../assets/jasenyys_kuva2.jpg";
import TextBlock from "../components/TextBlock";
import FadeInOnScroll from "../components/FadeInOnScroll";

const benefits = [
  "OmaSP Stadion/SJK - Kaikista aikuisten juomista -25%",
  "SJK-Juniorit/kannattajapäädyn kioski - Makkara 2€, kahvi 2,50€, vesi oston yhteydessä maksutta, muuten 1€.",
  "Irish Pub Danny Boy - Hanajuomat -15%",
  "El Cebo - Annoksista -10% (ei koske lounasaikaa)",
  "Seinäjoen Keilahalli - Salikäynneistä ja -korteista opiskelijahinnat",
];

const Instructions: React.FC = () => {
  return (
    <div className="instructions">
      <div className="donations-content">
        <h2>Liittymisohje Meidän Kerho ry:n jäseneksi</h2>
        <p>
          Jäseneksi voit liittyä lähettämällä tarvittavat tiedot sähköpostitse ja maksamalla jäsenmaksun. Toimi näin:
        </p>
        <div className="donation-card">
          <div className="step">
            <h3 className="step-title">1. Lähetä sähköpostiviesti</h3>
            <ul>
              <li>
                <strong>Osoite:</strong> posti@meidankerho.fi
              </li>
              <li>
                <strong>Aihe:</strong> "jäsentiedot"
              </li>
              <li>
                <strong>Henkilötiedot:</strong>
                <ul>
                  <li>Etu- ja sukunimi</li>
                  <li>Sähköpostiosoite</li>
                  <li>Puhelinnumero</li>
                </ul>
              </li>
              <p></p>
              <li></li>
            </ul>
          </div>
          <div className="step">
            <h3 className="step-title">2. Maksa jäsenmaksu</h3>
            <ul>
              <li>
                <strong>Uusi jäsen:</strong> 30€ (vuosittainen 20€ + liittymismaksu 10€)
              </li>
              <li>
                <strong>Vanha jäsen:</strong> 20€ (vuosittainen jäsenmaksu)
              </li>
              <li>
                <strong>Tilinumero:</strong> FI29 4108 0013 1821 60
              </li>
              <li>
                <strong>Maksunsaaja:</strong> Meidän Kerho ry
              </li>
              <li>
                <strong>Ei viitettä. Kirjoita viestikenttään:</strong>
                <ul>
                  <li>Uusi jäsen: "Liittyminen25"</li>
                  <li>Vanha jäsen: "Jäsenmaksu25"</li>
                </ul>
              </li>
            </ul>
          </div>
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
      <FadeInOnScroll>
        <div className="component-wrapper">
          <TextBlock
            heading="Jäsenyyden edut"
            content="Oikeus mahdollisten ytkeiden kanssa:"
            list={benefits}
          />
        </div>
      </FadeInOnScroll>
      <FadeInOnScroll>
        <div className="component-wrapper">
          <Instructions />
        </div>
      </FadeInOnScroll>
    </div>
  </>
);

export default Join;