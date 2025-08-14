import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import FadeInOnScroll from "../components/FadeInOnScroll";
import config from "../config";

// Define the type for an Album
interface AlbumType {
  _id: string;
  title: string;
  description?: string;
}

const Gallery: React.FC = () => {
  const [catalogs, setCatalogs] = useState<AlbumType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        // Fetch only top-level albums (catalogs)
        const response = await fetch(`${config.API_BASE_URL}/gallery/albums?parent=null`);
        if (!response.ok) {
          throw new Error("Failed to fetch catalogs.");
        }
        const data = await response.json();
        setCatalogs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />
      <div className="container page-content">
        <FadeInOnScroll>
          <div className="component-wrapper">
            <h2 className="upcoming-events-title" style={{ marginBottom: "45px" }}>
              Galleria
            </h2>
            {loading && <p>Ladataan...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && (
              <div className="chants-grid">
                {catalogs.length > 0 ? (
                  catalogs.map((catalog) => (
                    <Link
                      key={catalog._id}
                      to={`/gallery/${catalog._id}`}
                      className="chant-title-box" // Reusing your existing style
                    >
                      <h3 className="chant-title">{catalog.title}</h3>
                    </Link>
                  ))
                ) : (
                  <p>Kuvia ei ole vielä lisätty.</p>
                )}
              </div>
            )}
          </div>
        </FadeInOnScroll>
      </div>
    </>
  );
};

export default Gallery;