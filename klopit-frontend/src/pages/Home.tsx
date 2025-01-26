// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import BackgroundImage from "../components/BackgroundImage";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import MembershipBenefits from "../components/MembershipBenefits";
import Donations from "../components/Donations";
import InstaFeed from "../components/InstaFeed";
import homeBg from "../assets/etusivu_kuva1.png";
import config from "../config";

interface EventType {
  _id: string;
  title: string;
  date: string;
  description: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);

  // Fetch a small list of events (e.g. 3) from backend
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        // data should be an array of events
        // If you only want 3, slice here (or rely on maxEvents prop)
        setEvents(data);
      })
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
        {/* Show the 3 most recent events */}
        <UpcomingEventsSection 
          events={events}
          maxEvents={3}
          title="Tulevat tapahtumat"
        />
        <MembershipBenefits />
        <Donations />
        <InstaFeed />
      </div>
    </>
  );
};

export default Home;
