import React from "react";
import BackgroundImage from "../components/BackgroundImage";
import MembershipBenefits from "../components/MembershipBenefits";
import TextBlock from "../components/TextBlock";
import aboutBg from "../assets/meistä_kuva1.png";

const About: React.FC = () => (
  <>
    <BackgroundImage
      image={aboutBg}
      title="Meistä"
      description=""
      variant="default"
    />
    <div className="container page-content">
      <div className="component-wrapper">
        <TextBlock
          heading="Meidän Kerho ry"
          content={`Klopit Seinäjoki on intohimoinen ja omistautunut SJK:n kannattajaryhmä, joka tuo kansainvälisen fanikulttuurin tuulahduksen Pohjanmaalle. Klopit muodostavat SJK:n kannattajapäädyn sydämen OmaSp Stadionin länsipäädyn seisomakatsomossa. Heidän mustakultaiset värit, liput ja bannerit näkyvät kauas, ja ryhmän luoma tunnelma kuuluu stadionin jokaiselle nurkalle – parhaimmillaan jopa kansainvälisten areenojen tasolla.

Klopit eivät tue pelkästään omiaan katsomossa. He ovat järjestäneet rockfestivaaleja, palkinneet vuosittain Vuoden Pelaajan Kloppien Kannu -kiertopalkinnolla ja olleet mukana talkoohengessä tukemassa seuraa vaikeina hetkinä. Vieraspelireissuista paikalliseen kannattajakulttuurin kehittämiseen, Klopit ovat keskeinen osa SJK-perhettä.

Vuonna 2010 Klopit palkittiin Pohjanmaan Urheilugaalassa Vuoden Jokeri -palkinnolla tunnustuksena heidän arvokkaasta panoksestaan alueen jalkapallokulttuuriin. Klopit elävät periaatteella: tuki omille on aina taattua, eikä koskaan luovuteta.

Liity mukaan ja koe yhdessä kannattamisen ilo ja voima – niin kotona kuin vieraissa!`}
        />
      </div>

      <div className="component-wrapper spacing-medium">
        <MembershipBenefits />
      </div>
    </div>
  </>
);

export default About;
