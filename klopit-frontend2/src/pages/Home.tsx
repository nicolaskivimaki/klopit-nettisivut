// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import BackgroundImage from "../components/BackgroundImage";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import MembershipBenefits from "../components/MembershipBenefits";
import Donations from "../components/Donations";
import InstaFeed from "../components/InstaFeed";
import homeBg from "../assets/etusivu_kuva1.jpg";
import FadeInOnScroll from "../components/FadeInOnScroll";
import config from "../config";

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
        description=""
        variant="frontPage"
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
            <MembershipBenefits />
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="component-wrapper spacing-small">
            <Donations />
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="component-wrapper">
            <InstaFeed />
          </div>
        </FadeInOnScroll>
      </div>
    </>
  );
};

export default Home;