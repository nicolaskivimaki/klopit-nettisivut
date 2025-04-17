import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackgroundImage from "../components/BackgroundImage";
import { Link } from "react-router-dom";
import config from "../config";
import FadeInOnScroll from "../components/FadeInOnScroll";

interface ChantType {
  _id: string;
  title: string;
  lyrics: string;
  author?: string;
  category?: string;
}

const Chants: React.FC = () => {
  const { user } = useAuth();
  const [chants, setChants] = useState<ChantType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingChantId, setEditingChantId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ChantType>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChants = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/chants`);
        if (!response.ok) {
          throw new Error(`Failed to fetch chants: ${response.statusText}`);
        }
        const data = await response.json();
        setChants(data);
      } catch (err) {
        console.error("Error fetching chants:", err);
        setError("Chanttien lataaminen epäonnistui: " + (err as Error).message);
      }
    };

    fetchChants();
  }, []);

  const handleDeleteChant = async (chantId: string) => {
    if (!user?.isAdmin) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/chants/${chantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setChants((prev) => prev.filter((chant) => chant._id !== chantId));
      } else {
        console.error("Failed to delete chant.");
      }
    } catch (error) {
      console.error("Error deleting chant:", error);
    }
  };

  const handleEditClick = (chant: ChantType) => {
    setEditingChantId(chant._id);
    setEditFormData({
      title: chant.title,
      lyrics: chant.lyrics,
      author: chant.author,
      category: chant.category,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (chantId: string) => {
    if (!user?.isAdmin) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/chants/${chantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editFormData.title,
          lyrics: editFormData.lyrics,
          author: editFormData.author,
          category: editFormData.category,
        }),
      });

      if (response.ok) {
        const updatedChant = await response.json();
        setChants((prev) =>
          prev.map((chant) =>
            chant._id === chantId
              ? {
                  ...chant,
                  title: updatedChant.title,
                  lyrics: updatedChant.lyrics,
                  author: updatedChant.author,
                  category: updatedChant.category,
                }
              : chant
          )
        );
        setEditingChantId(null);
      } else {
        console.error("Failed to update chant.");
      }
    } catch (error) {
      console.error("Error updating chant:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingChantId(null);
  };

  if (error) {
    return (
      <div className="container page-content">
        <div className="component-wrapper">
          <h2 className="upcoming-events-title">Chänttikirja</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />
      <div className="container page-content">
        <FadeInOnScroll>
          <div className="component-wrapper">
            <h2 className="upcoming-events-title" style={{ marginBottom: "45px" }}>
              Chänttikirja
            </h2>
            {/* Admin controls */}
            {user?.isAdmin && (
              <div className="button-container" style={{ marginBottom: "24px" }}>
                {!editMode ? (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditMode(true)}
                  >
                    Muokkaa chantteja
                  </button>
                ) : (
                  <>
                    <Link to="/chants/new">
                      <button
                        className="btn btn-primary"
                        style={{ marginRight: "16px" }}
                      >
                        Lisää chantti
                      </button>
                    </Link>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Valmis
                    </button>
                  </>
                )}
              </div>
            )}
            <div className="chants-grid">
              {chants.length > 0 ? (
                chants.map((chant) => (
                  <div key={chant._id}>
                    {editingChantId === chant._id ? (
                      <div className="edit-chant-form">
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
                          <label className="form-label">Sanoitus</label>
                          <textarea
                            name="lyrics"
                            className="input-field"
                            value={editFormData.lyrics || ""}
                            onChange={handleEditChange}
                            rows={4}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Tekijä (valinnainen)</label>
                          <input
                            type="text"
                            name="author"
                            className="input-field"
                            value={editFormData.author || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Kategoria (valinnainen)</label>
                          <input
                            type="text"
                            name="category"
                            className="input-field"
                            value={editFormData.category || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className="form-buttons">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditSubmit(chant._id)}
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
                      <Link to={`/chants/${chant._id}`} className="chant-title-box">
                        <h3 className="chant-title">{chant.title}</h3>
                        {editMode && user?.isAdmin && (
                          <div className="admin-buttons">
                            <button
                              className="btn btn-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEditClick(chant);
                              }}
                            >
                              Muokkaa
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteChant(chant._id);
                              }}
                            >
                              Poista
                            </button>
                          </div>
                        )}
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <p>Ei chantteja saatavilla.</p>
              )}
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </>
  );
};

export default Chants;