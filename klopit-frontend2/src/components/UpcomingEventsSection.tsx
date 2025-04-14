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
  isHomePage?: boolean; // Prop to distinguish home page
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  maxEvents,
  title = "Tulevat tapahtumat",
  showViewAll = true,
  isHomePage = false, // Default to false (events page context)
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
      {/* New wrapper for horizontal scrolling */}
      <div className="scroll-container">
        <div className={isHomePage ? "home-events" : "events-grid"}>
          {displayedEvents.map((event, index) => (
            <div key={event._id} className="event-card">
              {/* Event card content */}
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
                to={`/events/${event._id}?from=${isHomePage ? "home" : "events"}`}
                className="btn btn-primary"
              >
                Lue lisää
              </Link>
            </div>
          ))}
        </div>
      </div>
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