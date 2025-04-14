import React from "react";
import { Link } from "react-router-dom";

interface EventData {
  _id: string;
  title: string;
  date: string;
  description: string;
}

interface UpcomingEventsSectionProps {
  events: EventData[];
  maxEvents?: number; // 3 for home page, undefined for all events
  title?: string;
  showViewAll?: boolean;
  isHomePage?: boolean; // Prop to distinguish home page usage
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  maxEvents,
  title = "Tulevat tapahtumat",
  showViewAll = true,
  isHomePage = false,
}) => {
  const filteredEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const displayedEvents = maxEvents ? filteredEvents.slice(0, maxEvents) : filteredEvents;

  // Format date to Finnish format: dd.mm.yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="upcoming-events">
      <h2 className={`upcoming-events-title ${isHomePage ? "home-events-title" : ""}`}>
        {title}
      </h2>
      {isHomePage ? (
        // Only on the home page, wrap events in a scrollable container
        <div className="scroll-container">
          <div className="home-events">
            {displayedEvents.map((event, index) => (
              <div key={event._id} className="event-card">
                <div className="event-card-content">
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-date">{formatDate(event.date)}</p>
                  <p className="event-card-description">
                    {event.description.length > 100
                      ? `${event.description.substring(0, 100)}...`
                      : event.description}
                  </p>
                  <div className={`event-card-accent accent-${index + 1}`}></div>
                </div>
                <Link
                  to={`/events/${event._id}?from=home`}
                  className="btn btn-primary"
                >
                  Lue lisää
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // When not on the home page, render a grid layout without horizontal scrolling
        <div className="events-grid">
          {displayedEvents.map((event, index) => (
            <div key={event._id} className="event-card">
              <div className="event-card-content">
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-date">{formatDate(event.date)}</p>
                <p className="event-card-description">
                  {event.description.length > 100
                    ? `${event.description.substring(0, 100)}...`
                    : event.description}
                </p>
                <div className={`event-card-accent accent-${index + 1}`}></div>
              </div>
              <Link
                to={`/events/${event._id}?from=events`}
                className="btn btn-primary"
              >
                Lue lisää
              </Link>
            </div>
          ))}
        </div>
      )}
      {showViewAll && (
        <div className="view-all">
          <Link to="/events" className="btn btn-primary">
            Kaikki tapahtumat
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsSection;
