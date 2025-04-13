import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import config from "../config";

const CreateChant: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    lyrics: "",
    author: "",
    category: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Redirect non-admins
  if (!user?.isAdmin) {
    navigate("/chants");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Kirjautuminen vaaditaan.");
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/chants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/chants");
      } else {
        setError("Chantin luominen epäonnistui.");
      }
    } catch (error) {
      console.error("Error creating chant:", error);
      setError("Tapahtui virhe. Yritä uudelleen.");
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
        <div className="component-wrapper">
          <div className="back-button-container">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/chants")}
            >
              Takaisin
            </button>
          </div>
          <h2 className="upcoming-events-title" style={{ marginBottom: "10px" }}>
            Lisää uusi chantti
          </h2>
          <div className="create-chant-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Otsikko*</label>
                <input
                  type="text"
                  name="title"
                  className="input-field"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sanoitus*</label>
                <textarea
                  name="lyrics"
                  className="input-field"
                  value={formData.lyrics}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tekijä</label>
                <input
                  type="text"
                  name="author"
                  className="input-field"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tune</label>
                <input
                  type="text"
                  name="category"
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
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

export default CreateChant;