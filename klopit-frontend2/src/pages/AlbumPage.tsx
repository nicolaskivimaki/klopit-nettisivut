import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import FadeInOnScroll from "../components/FadeInOnScroll";
import config from "../config";
import { useAuth } from "../context/AuthContext";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface AlbumType {
  _id: string;
  title: string;
  description?: string;
}

interface ImageType {
  _id: string;
  url: string;
  caption?: string;
}

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [subAlbums, setSubAlbums] = useState<AlbumType[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const { user } = useAuth();
  
  const getImageUrl = (rawUrl: string): string => {
    if (!rawUrl) return "";
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      return rawUrl;
    }

    const apiUrl = new URL(config.API_BASE_URL, window.location.origin);
    const apiOrigin = apiUrl.origin;
    return new URL(rawUrl, apiOrigin).toString();
  };

  useEffect(() => {
    if (!id) return;
    const fetchAlbumContent = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/gallery/albums/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch album content.");
        }
        const { album, subAlbums, images } = await response.json();
        setAlbum(album);
        setSubAlbums(subAlbums);
        setImages(images);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumContent();
  }, [id]);

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän kuvan?")) {
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!user?.isAdmin || !token) {
      alert("Toiminto vaatii ylläpitäjän oikeudet.");
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/gallery/images/${imageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setImages(prevImages => prevImages.filter(image => image._id !== imageId));
      } else {
        throw new Error('Kuvan poistaminen epäonnistui.');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />
      <div className="container page-content">
        <div className="back-button-container">
          <Link to="/gallery" className="btn btn-secondary">
            Takaisin galleriaan
          </Link>
        </div>
        <FadeInOnScroll>
          <div className="component-wrapper">
            {loading && <p>Ladataan...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {album && (
              <>
                <h2 className="upcoming-events-title">{album.title}</h2>
                {album.description && <p>{album.description}</p>}

                {subAlbums.length > 0 && (
                  <div style={{ marginTop: '40px' }}>
                    <h3 style={{ color: 'var(--primary-color)' }}>Sub-albumit</h3>
                    <div className="chants-grid">
                      {subAlbums.map((sub) => (
                        <Link key={sub._id} to={`/gallery/${sub._id}`} className="chant-title-box">
                          <h3 className="chant-title">{sub.title}</h3>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {images.length > 0 && (
                  <div style={{ marginTop: '40px' }}>
                    <h3 style={{ color: 'var(--primary-color)' }}>Kuvat</h3>
                    <div className="image-grid">
                      {images.map((image, index) => (
                        <div key={image._id} className="image-grid-item">
                          {user?.isAdmin && (
                              <button
                                className="delete-image-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteImage(image._id);
                                }}
                              >
                                Poista
                              </button>
                          )}
                          <img 
                            src={getImageUrl(image.url)} 
                            alt={image.caption || album.title} 
                            onClick={() => {
                              setImageIndex(index);
                              setLightboxOpen(true);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </FadeInOnScroll>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images.map((image) => ({ src: getImageUrl(image.url) }))}
        index={imageIndex}
      />
    </>
  );
};

export default AlbumPage;
