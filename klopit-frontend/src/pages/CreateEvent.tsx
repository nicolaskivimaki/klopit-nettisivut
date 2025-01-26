// src/pages/CreateEvent.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../config";

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>();

  // If not admin, redirect or show message
  if (!user?.isAdmin) {
    return <p>Access denied. Admins only.</p>;
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in as admin.");
      return;
    }

    try {
      const res = await fetch(`${config.API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          date, // Just send the raw string ("YYYY-MM-DD"); the backend will parse it
          description,
          maxParticipants: limitEnabled ? maxParticipants : undefined,
        }),
      });

      if (res.ok) {
        // Successfully created
        alert("Event created successfully!");
        // navigate to the /events page
        navigate("/events");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    }
  };

  return (
    <div className="container page-content">
      <h1>Luo uusi tapahtuma</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <div>
          <label>Otsikko</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Päivämäärä (YYYY-MM-DD)</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Kuvaus</label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kerro tapahtumasta..."
            style={{ width: "100%" }}
            required
          />
        </div>
        <div>
          <label>Lisää ilmoittautumislomake</label>
          <input
            type="checkbox"
            checked={limitEnabled}
            onChange={(e) => {
              setLimitEnabled(e.target.checked);
              if (!e.target.checked) {
                setMaxParticipants(undefined);
              }
            }}
            style={{ marginLeft: "0.5rem" }}
          />
        </div>
        {limitEnabled && (
          <div>
            <label>Maksimimäärä osallistujia</label>
            <input
              type="number"
              value={maxParticipants ?? ""}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              min={1}
              style={{ width: "100%" }}
            />
          </div>
        )}
        <button type="submit">Tallenna</button>
      </form>
    </div>
  );
};

export default CreateEvent;
