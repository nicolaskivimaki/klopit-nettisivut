import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import config from "../config";

interface ChantType {
  _id: string;
  title: string;
  lyrics: string;
  author?: string;
  category?: string;
}

const ChantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chant, setChant] = useState<ChantType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChant = async () => {
      try {
        console.log("Fetching chant from:", `${config.API_BASE_URL}/chants/${id}`);
        const response = await fetch(`${config.API_BASE_URL}/chants/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch chant: ${response.statusText}`);
        }
        const data = await response.json();
        setChant(data);
      } catch (err) {
        console.error("Error fetching chant:", err);
        setError("Chantin lataaminen epäonnistui: " + (err as Error).message);
      }
    };

    fetchChant();
  }, [id]);

  if (error) {
    return (
      <div className="container page-content">
        <div className="component-wrapper">
          <h2 className="upcoming-events-title">Chantti</h2>
          <p className="error-message">{error}</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/chants")}
          >
            Takaisin
          </button>
        </div>
      </div>
    );
  }

  if (!chant) {
    return (
      <div className="container page-content">
        <div className="component-wrapper">
          <p>Ladataan...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundImage
        image=""
        title="" // Changed to empty string to make header empty
        description=""
        variant="default"
      />
      <div className="container page-content">
        <div className="component-wrapper">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/chants")}
            style={{ marginBottom: "16px" }}
          >
            Takaisin
          </button>
          <div className="chant-detail">
            <h2 className="chant-detail-title">{chant.title}</h2>
            {chant.category && (
              <p className="chant-detail-category">Tune: {chant.category}</p>
            )}
            <p className="chant-detail-lyrics">{chant.lyrics}</p>
            {chant.author && (
              <p className="chant-detail-author">Tekijä: {chant.author}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChantDetail;