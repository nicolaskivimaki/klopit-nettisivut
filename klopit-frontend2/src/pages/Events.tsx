import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackgroundImage from "../components/BackgroundImage";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import CalendarView from "../components/CalendarView";
import { Link } from "react-router-dom";
import config from "../config";

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

  // ... (the rest of your event handling code remains unchanged)

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />
      <div className="container page-content">
        {user?.isAdmin && (
          <div className="component-wrapper spacing-small">
            {!editMode ? (
              <div className="button-container">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditMode(true)}
                >
                  Muokkaa tapahtumia
                </button>
              </div>
            ) : (
              <div className="button-container">
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
          </div>
        )}
        <div className="component-wrapper">
          {editMode ? (
            <div className="events-grid">
              {/* Admin edit mode content for events */}
            </div>
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
                      onChange={() =>
                        setViewMode(viewMode === "list" ? "calendar" : "list")
                      }
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
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
      </div>
    </>
  );
};

export default Events;
