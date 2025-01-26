import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../config";
import BackgroundImage from "../components/BackgroundImage";

interface Registration {
  name: string;
  email: string;
}

const EventPage: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  // Modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Registration form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("Error fetching event:", err));
  }, [id]);

  // Handle registration
  const handleRegister = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        // Update local event registrations
        setEvent((prev: any) => ({
          ...prev,
          registrations: data.registrations,
        }));

        // Clear fields and close modal
        setName("");
        setEmail("");
        setShowRegisterModal(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  if (!event)
    return (
      <div className="container page-content">
        <p>Loading event...</p>
      </div>
    );

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />

      <div className="container page-content event-page">
        <Link to="/events" className="back-link">
          &laquo; Takaisin
        </Link>

        <h1>{event.title}</h1>
        <h3 className="event-meta">
          {event.date
            ? new Date(event.date).toLocaleDateString("fi-FI")
            : "Ei päivämäärää"}
        </h3>
        <p className="event-description">{event.description}</p>

        {/* Conditional rendering for registration info and button */}
        {event.maxParticipants && (
          <div className="registrations">
            <h3>
              Ilmoittautuneet {event.registrations?.length ?? 0} /{" "}
              {event.maxParticipants}
            </h3>
            {event.registrations && event.registrations.length > 0 ? (
              <table className="registration-table">
                <thead>
                  <tr>
                    <th>Nimi</th>
                    <th>Sähköposti</th>
                  </tr>
                </thead>
                <tbody>
                  {event.registrations.map((reg: Registration, index: number) => (
                    <tr key={index}>
                      <td>{reg.name}</td>
                      <td>{reg.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Ei ilmoittautuneita vielä.</p>
            )}

            {/* Hide button when modal is shown */}
            {!showRegisterModal && (
              <button
                className="register-button"
                onClick={() => setShowRegisterModal(true)}
              >
                Ilmoittaudu
              </button>
            )}
          </div>
        )}

        {showRegisterModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowRegisterModal(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Ilmoittaudu tapahtumaan: {event.title}</h3>
              <div className="input-group">
                <input
                    type="text"
                    placeholder="Nimi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Sähköposti"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
              <div className="button-group">
                <button onClick={handleRegister}>Lähetä</button>
                <button onClick={() => setShowRegisterModal(false)}>Peruuta</button>
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventPage;
