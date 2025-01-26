// UpcomingEventsSection.tsx
import React from "react";
import { Link } from "react-router-dom";

interface EventData {
  _id: string; // match your MongoDB field
  title: string;
  date: string;
  description: string;
  // you can add more fields if needed (maxParticipants, etc.)
}

interface UpcomingEventsSectionProps {
  events: EventData[];
  maxEvents?: number;
  title?: string;
  showViewAll?: boolean;
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  maxEvents,
  title = "Tulevat tapahtumat",
  showViewAll = true,
}) => {
  // Filter only future events
  const filteredEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const displayedEvents = maxEvents ? filteredEvents.slice(0, maxEvents) : filteredEvents;

  return (
    <div className="upcoming-events">
      <h2 className="upcoming-events-title">{title}</h2>
      <div className="events-grid">
        {displayedEvents.map((event) => (
          <div key={event._id} className="card">
            <div className="card-header">
              <p className="event-date">
                {new Date(event.date).toLocaleDateString("fi-FI")}
              </p>
              <h3 className="event-title">{event.title}</h3>
            </div>
            <div className="card-body">
              <p className="event-description">{event.description}</p>
            </div>
            {/* Link to /events/:_id instead of /events/:id */}
            <Link to={`/events/${event._id}`} className="card-button">
              Lue lisää
            </Link>
          </div>
        ))}
      </div>
      {showViewAll && (
        <div className="view-all">
          <Link to="/events" className="view-all-button">
            Kaikki tapahtumat
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsSection;
