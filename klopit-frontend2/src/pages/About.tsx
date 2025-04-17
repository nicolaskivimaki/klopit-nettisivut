import React from "react";
import BackgroundImage from "../components/BackgroundImage";
import MembershipBenefits from "../components/MembershipBenefits";
import TextBlock from "../components/TextBlock";
import aboutBg from "../assets/meista_kuva1.jpg";
import FadeInOnScroll from "../components/FadeInOnScroll";

const About: React.FC = () => (
  <>
    <BackgroundImage
      image={aboutBg}
      title="Meistä"
      description=""
      variant="default"
    />
    <div className="container page-content">
      <FadeInOnScroll>
        <div className="component-wrapper">
        <TextBlock
          heading="Meidän Kerho ry"
          content={`Meidän Kerho ryn on SJK-kannattajien perustama yhdistys, jonka tarkoituksena on tukea sekä edistää jalkapallo- ja kannattajakulttuuria Seinäjoella.
          
          Yhdistys järjestää vieraspelimatkoja, myy kannattajatuotteita, järjestää kannattajia yhteisöllistäviä tapahtumia, järjestää talkoita toteuttaakseen katsomokoreografioita ja on yksi neuvottelupuolista seuran ja tukiryhmien kanssa, kun sovitaan kannattajatoimintaan sekä ottelutapahtumissa siihen vaikuttavista asioista. 
          
          Meidän Kerho ry on voittoa tavoittelematon yhdistys, jonka keräämät jäsen- ja tukimaksut menevät suoraan toiminnan kehittämiseen, kuten vieraspelimatkoihin, katsomomateriaaleihin sekä tifoihin.
          
          Yhdistys ei ole yksittäinen kannattajaryhmä, vaan toimii palvellakseen kaikkia ryhmiä ja yksittäisiä SJK-kannattajia syrjimättä ja valikoimatta.`}
          />
        </div>
      </FadeInOnScroll>
      <FadeInOnScroll>
        <div className="component-wrapper spacing-medium">
          <MembershipBenefits />
        </div>
      </FadeInOnScroll>
    </div>
  </>
);

export default About;
