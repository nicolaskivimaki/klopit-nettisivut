import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackgroundImage from "../components/BackgroundImage";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import { Link } from "react-router-dom";
import config from "../config";

interface EventType {
    _id: string;
    title: string;
    date: string;
    description: string;
}
  
const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [editMode, setEditMode] = useState(false);

  // Fetch events from your backend when component mounts
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        // data should be an array of Event objects
        setEvents(data);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
      });
  }, []);

  // Handle deleting an event (admin only)
  const handleDeleteEvent = async (eventId: string) => {
    if (!user?.isAdmin) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the deleted event from state
        setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      } else {
        console.error("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };


  return (
    <>
      <BackgroundImage
        image=""
        title=""
        description=""
        variant="default"
      />

      <div className="container page-content">

      {user?.isAdmin && !editMode && (
        <div className="button-container">
            <button
            onClick={() => setEditMode(true)}
            style={{ marginLeft: "16px", marginTop: "40px" }} // Add padding/margin directly
            >
            Muokkaa tapahtumia
            </button>
        </div>
        )}

        {user?.isAdmin && editMode && (
        <div className="button-container" style={{ marginBottom: "1rem" }}>
            <Link
            to="/events/new"
            style={{ marginRight: "1rem", marginLeft: "16px", marginTop: "40px", marginBottom: "20px" }} // Adjust the margin for the link
            >
            <button>Lisää tapahtuma</button>
            </Link>
            <button
            onClick={() => setEditMode(false)}
            style={{ marginLeft: "16px", marginTop: "40px", marginBottom: "20px" }} // Add padding/margin directly
            >
            Valmis
            </button>
        </div>
        )}

        {/* Normal mode: show the standard UpcomingEventsSection */}
        {!editMode && (
          <UpcomingEventsSection
            events={events}
            maxEvents={9}
            title="Kaikki tapahtumat"
            showViewAll={false}
          />
        )}

        {/* Edit mode: show each event with a "Poista" button */}
        {editMode && (
          <div className="events-grid">
            {events.map((event) => (
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
                <button onClick={() => handleDeleteEvent(event._id)}>
                  Poista
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
