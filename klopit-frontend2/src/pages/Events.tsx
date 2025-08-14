import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackgroundImage from "../components/BackgroundImage";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import CalendarView from "../components/CalendarView";
import { Link } from "react-router-dom";
import config from "../config";
import FadeInOnScroll from "../components/FadeInOnScroll";

interface EventType {
  _id: string;
  title: string;
  date: string;
  description: string;
  maxParticipants?: number;
}

const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<EventType>>({});

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

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
        setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      } else {
        console.error("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditClick = (event: EventType) => {
    setEditingEventId(event._id);
    setEditFormData({
      title: event.title,
      date: event.date.split("T")[0],
      description: event.description,
      maxParticipants: event.maxParticipants,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (eventId: string) => {
    if (!user?.isAdmin) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editFormData.title,
          date: new Date(editFormData.date!).toISOString(),
          description: editFormData.description,
          maxParticipants: editFormData.maxParticipants
            ? Number(editFormData.maxParticipants)
            : undefined,
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents((prev) =>
          prev.map((ev) =>
            ev._id === eventId
              ? {
                  ...ev,
                  title: updatedEvent.title,
                  date: updatedEvent.date,
                  description: updatedEvent.description,
                  maxParticipants: updatedEvent.maxParticipants,
                }
              : ev
          )
        );
        setEditingEventId(null);
      } else {
        console.error("Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "calendar" : "list");
  };

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />
      <div className="container page-content">
        <FadeInOnScroll>
          <div className="component-wrapper">
            {editMode ? (
              <>
                {user?.isAdmin && (
                  <div
                    className="button-container"
                    style={{ marginBottom: "24px" }}
                  >
                    <Link to="/events/new">
                      <button
                        className="btn btn-primary"
                        style={{ marginRight: "16px" }}
                      >
                        Lisää tapahtuma
                      </button>
                    </Link>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Valmis
                    </button>
                  </div>
                )}
                <div className="events-grid">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="event-card admin-event-card"
                    >
                      {editingEventId === event._id ? (
                        <div className="edit-event-form">
                          <div className="form-group">
                            <label className="form-label">Otsikko</label>
                            <input
                              type="text"
                              name="title"
                              className="input-field"
                              value={editFormData.title || ""}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Päivämäärä</label>
                            <input
                              type="date"
                              name="date"
                              className="input-field"
                              value={editFormData.date || ""}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Kuvaus</label>
                            <textarea
                              name="description"
                              className="input-field"
                              value={editFormData.description || ""}
                              onChange={handleEditChange}
                              rows={4}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Maksimimäärä osallistujia (valinnainen)
                            </label>
                            <input
                              type="number"
                              name="maxParticipants"
                              className="input-field"
                              value={editFormData.maxParticipants ?? ""}
                              onChange={handleEditChange}
                              min={1}
                            />
                          </div>
                          <div className="form-buttons">
                            <button
                              className="btn btn-primary"
                              onClick={() => handleEditSubmit(event._id)}
                            >
                              Tallenna
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={handleCancelEdit}
                            >
                              Peruuta
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Link to={`/events/${event._id}?from=events`}>
                          <div className="event-card-content">
                            <p className="event-card-date">
                              {new Date(event.date).toLocaleDateString(
                                "fi-FI"
                              )}
                            </p>
                            <h3 className="event-card-title">{event.title}</h3>
                            <p className="event-card-description">
                              {event.description}
                            </p>
                            <div className="admin-buttons">
                              <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEditClick(event);
                                }}
                              >
                                Muokkaa
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteEvent(event._id);
                                }}
                              >
                                Poista
                              </button>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="view-toggle-container">
                  <h2 className="upcoming-events-title">Kaikki tapahtumat</h2>
                  <div className="view-toggle">
                    <span>Näytä kalenteri</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={viewMode === "calendar"}
                        onChange={toggleViewMode}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {user?.isAdmin && (
                  <div
                    className="button-container"
                    style={{ marginTop: "24px", marginBottom: "24px" }}
                  >
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditMode(true)}
                    >
                      Muokkaa tapahtumia
                    </button>
                  </div>
                )}

                {viewMode === "list" ? (
                  <UpcomingEventsSection
                    events={events}
                    maxEvents={9}
                    title=""
                    showViewAll={false}
                  />
                ) : (
                  <CalendarView events={events} />
                )}
              </>
            )}
          </div>
        </FadeInOnScroll>
      </div>
    </>
  );
};

export default Events;