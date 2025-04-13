import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../config";
import BackgroundImage from "../components/BackgroundImage";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>();
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateError, setDateError] = useState<string | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!user?.isAdmin) {
    return <p>Access denied. Admins only.</p>;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in as admin.");
      return;
    }

    if (!date) {
      alert("Please select a date for the event.");
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
          date: date.toISOString(),
          description,
          maxParticipants: limitEnabled ? maxParticipants : undefined,
        }),
      });

      if (res.ok) {
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

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setDateInput(format(selectedDate, "dd.MM.yyyy"));
    setDateError(null);
    setShowCalendar(false);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);

    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;

    if (!value) {
      setDate(null);
      setDateError(null);
      return;
    }

    const match = value.match(dateRegex);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const parsedDate = new Date(year, month, day);

      if (
        parsedDate.getDate() === day &&
        parsedDate.getMonth() === month &&
        parsedDate.getFullYear() === year
      ) {
        setDate(parsedDate);
        setDateError(null);
      } else {
        setDate(null);
        setDateError("Virheellinen päivämäärä. Käytä muotoa pp.kk.vvvv.");
      }
    } else {
      setDate(null);
      if (value.length >= 10) {
        setDateError("Käytä muotoa pp.kk.vvvv (esim. 01.01.2025).");
      } else {
        setDateError(null);
      }
    }
  };

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />
      <div className="container page-content">
        <div className="back-button-container">
          <Link to="/events">
            <button className="btn btn-secondary">Takaisin</button>
          </Link>
        </div>

        <h1>Luo uusi tapahtuma</h1>

        <div className="events-grid">
          <div className="card">
            <form onSubmit={handleSubmit} className="create-event-form">
              <div className="form-group">
                <label className="form-label">Otsikko</label>
                <input
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Päivämäärä</label>
                <input
                  type="text"
                  className="input-field"
                  value={dateInput}
                  onChange={handleDateInputChange}
                  onClick={() => setShowCalendar(true)}
                  placeholder="pp.kk.vvvv (esim. 01.01.2025)"
                  required
                  ref={inputRef}
                />
                {dateError && <p className="error-message">{dateError}</p>}
                {showCalendar && (
                  <div className="calendar-picker" ref={calendarRef}>
                    <div className="calendar-header">
                      <button type="button" className="calendar-nav-btn" onClick={handlePrevMonth}>
                        &lt;
                      </button>
                      <h3 className="calendar-title">
                        {format(currentMonth, "MMMM yyyy")}
                      </h3>
                      <button type="button" className="calendar-nav-btn" onClick={handleNextMonth}>
                        &gt;
                      </button>
                    </div>
                    <div className="calendar-grid">
                      {["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"].map((day) => (
                        <div key={day} className="calendar-weekday">
                          {day}
                        </div>
                      ))}
                      {days.map((day, index) => {
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = date && isSameDay(day, date);
                        return (
                          <div
                            key={index}
                            className={`calendar-day ${!isCurrentMonth ? "empty-day" : ""} ${isSelected ? "selected-day" : ""}`}
                            onClick={() => isCurrentMonth && handleDateSelect(day)}
                          >
                            {isCurrentMonth && <span className="day-number">{format(day, "d")}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Kuvaus</label>
                <textarea
                  rows={6}
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kerro tapahtumasta..."
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={limitEnabled}
                    onChange={() => setLimitEnabled(!limitEnabled)}
                  />
                  &nbsp;Rajoita osallistujamäärä
                </label>
              </div>

              {limitEnabled && (
                <div className="form-group">
                  <label className="form-label">Maksimimäärä osallistujia</label>
                  <input
                    type="number"
                    className="input-field"
                    value={maxParticipants ?? ""}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    min={1}
                  />
                </div>
              )}
              <button type="submit" className="btn btn-primary">
                Tallenna
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
