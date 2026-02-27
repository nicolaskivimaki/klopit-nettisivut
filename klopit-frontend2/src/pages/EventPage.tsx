import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import config from "../config";
import BackgroundImage from "../components/BackgroundImage";
import LinkifiedText from "../components/LinkifiedText";

const EventPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("Error fetching event:", err));
  }, [id]);

  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from");
  const backLink = from === "home" ? "/" : "/events";

  if (!event)
    return (
      <>
        <BackgroundImage image="" title="" description="" variant="default" />
        <div className="container page-content">
          <p>Loading event...</p>
        </div>
      </>
    );

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />
      <div className="container page-content event-page">
        
          <div className="component-wrapper">
            <div className="back-button-container">
              <Link to={backLink} className="btn btn-secondary">
                Takaisin
              </Link>
            </div>
            <h1>{event.title}</h1>
            <h3 className="event-date">
              {event.date
                ? new Date(event.date).toLocaleDateString("fi-FI")
                : "Ei päivämäärää"}
            </h3>
            <p className="event-description">
              <LinkifiedText text={event.description ?? ""} />
            </p>
          </div>
      </div>
    </>
  );
};

export default EventPage;