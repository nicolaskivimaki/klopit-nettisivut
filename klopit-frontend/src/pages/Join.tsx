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

const Join: React.FC = () => (
  <>
    <BackgroundImage
      image={joinBg}
      title="Jäsenyys"
      description=""
      variant="default"
    />
    <div className="container flex-column page-content">
      <TextBlock
        heading="Jäsenyyden edut"
        content="Kloppien jäsenenä pääset nauttimaan muun muassa seuraavista jäseneduista:"
        list={benefits} // Pass the benefits list here
      />
    </div>
  </>
);

export default Join;
