import React from "react";
import BackgroundImage from "../components/BackgroundImage";
import joinBg from "../assets/jasenyys_kuva2.jpg";
import TextBlock from "../components/TextBlock";
import FadeInOnScroll from "../components/FadeInOnScroll";

const benefits = [
  "OmaSP Stadion/SJK - SJK:n ottelutapahtumissa kaikista aikuisten juomista -25%",
  "Irish Pub Danny Boy - Hanajuomat -15%",
  "El Cebo - Annoksista -10% (ei koske lounasaikaa)",
  "SJK-Juniorit/kannattajapäädyn kioski - Tulevan kauden edut selviää lähempänä kautta",
  "www.pekripe.fi - Kaikista tuotteista -15%",
];

const MEMBERSHIP_FORM_URL = "https://forms.gle/CDQMDKeHpWLhPABp6";

const Instructions: React.FC = () => {
  return (
    <div className="instructions">
      <div className="donations-content">
        <h2>Liittymisohje Meidän Kerho ry:n jäseneksi</h2>
        <p>
          Jäseneksi voit liittyä täyttämällä jäsenlomakkeen ja maksamalla jäsenmaksun.
          Toimi näin:
        </p>

        <div className="donation-card">
          <div className="step">
            <h3 className="step-title">1. Täytä jäsenlomake</h3>
            <ul>
              <li>
                <strong>Lomake:</strong>{" "}
                <a
                  href={MEMBERSHIP_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {MEMBERSHIP_FORM_URL}
                </a>
              </li>
            </ul>
          </div>

          <div className="step">
            <h3 className="step-title">2. Maksa jäsenmaksu</h3>
            <ul>
              <li>
                <strong>Uusi jäsen:</strong>
                <ul>
                  <li>35€ (aikuinen)</li>
                  <li>25€ (alaikäinen)</li>
                </ul>
              </li>

              <li>
                <strong>Vanha jäsen:</strong>
                <ul>
                  <li>25€ (aikuinen)</li>
                  <li>15€ (alaikäinen)</li>
                </ul>
              </li>

              <li>
                <strong>Tilinumero:</strong> FI29 4108 0013 1821 60
              </li>
              <li>
                <strong>Maksunsaaja:</strong> Meidän Kerho ry
              </li>
              <li>
                <strong>Ei viitettä.</strong>
              </li>
              <li>
                <strong>Kirjoita viestikenttään:</strong> jäsenyys, jonka ostat
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
    <BackgroundImage image={joinBg} title="Jäsenyys" description="" variant="default" />
    <div className="container page-content">
      <FadeInOnScroll>
        <div className="component-wrapper">
          <TextBlock
            heading="Jäsenyyden edut"
            content="Jäsenyydellä saat etuja yhteistyökumppaneilta:"
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
