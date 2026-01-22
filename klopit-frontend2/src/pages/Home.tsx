// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import BackgroundImage from "../components/BackgroundImage";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import MembershipBenefits from "../components/MembershipBenefits";
import Donations from "../components/Donations";
import homeBg from "../assets/etusivu_kuva1.jpg";
import FadeInOnScroll from "../components/FadeInOnScroll";
import config from "../config";
import membershipHomeImage from "../assets/jasenyys_kuva1.jpg";

interface EventType {
  _id: string;
  title: string;
  date: string;
  description: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events for Home:", error));
  }, []);

  return (
    <>
      <BackgroundImage
        image={homeBg}
        title="MEIDÄN KERHO"
        variant="frontPage"
        focus="50% 50%"
        focusMobile="50% 50%"
      />
      <div className="container page-content">
        <FadeInOnScroll>
        <div className="component-wrapper">
            <UpcomingEventsSection
              events={events}
              isHomePage={true}
              maxEvents={3}
              title="Tulevat tapahtumat"
            />
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="component-wrapper spacing-medium membership-reduced-gap">
            <MembershipBenefits imageSrc={membershipHomeImage} />
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="component-wrapper spacing-small">
            <Donations />
          </div>
        </FadeInOnScroll>
      </div>
    </>
  );
};

export default Home;