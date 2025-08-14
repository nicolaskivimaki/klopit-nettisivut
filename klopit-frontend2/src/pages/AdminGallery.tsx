import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import config from "../config";
import BackgroundImage from "../components/BackgroundImage";

interface AlbumType {
  _id: string;
  title: string;
}

type NotificationType = {
  message: string;
  type: "success" | "error";
};

const AdminGallery: React.FC = () => {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [newCatalogName, setNewCatalogName] = useState("");
  
  const [uploadAlbumId, setUploadAlbumId] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const fetchAllAlbums = async () => {
    const response = await fetch(`${config.API_BASE_URL}/gallery/albums`);
    const data = await response.json();
    setAlbums(data);
  };

  useEffect(() => {
    fetchAllAlbums();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleCreateCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !newCatalogName) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/gallery/albums`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newCatalogName, parent: null }),
      });
      if (response.ok) {
        showNotification("Katalogi luotu onnistuneesti!", "success");
        setNewCatalogName("");
        fetchAllAlbums();
      } else {
        throw new Error("Failed to create catalog.");
      }
    } catch (err) {
      showNotification((err as Error).message, "error");
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !files || !uploadAlbumId) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
    }

    try {
        const response = await fetch(`${config.API_BASE_URL}/gallery/images/upload/${uploadAlbumId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (response.ok) {
            showNotification('Kuvat ladattu onnistuneesti!', 'success');
            setFiles(null);
            (e.target as HTMLFormElement).reset();
        } else {
            throw new Error('Image upload failed.');
        }
    } catch (err) {
        showNotification((err as Error).message, "error");
    }
  };

  if (!user?.isAdmin) return <p>Access Denied.</p>;

  return (
    <>
      <BackgroundImage image="" title="" description="" variant="default" />
      <div className="container page-content">
        <div className="component-wrapper">
          <h2 className="upcoming-events-title">Gallerian hallinta</h2>

          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}

          <div className="create-chant-form" style={{ marginTop: '20px' }}>
             <form onSubmit={handleCreateCatalog}>
                <h3 style={{color: 'var(--primary-color)'}}>1. Luo uusi katalogi (esim. 2025)</h3>
                <div className="form-group">
                    <label className="form-label">Katalogin nimi</label>
                    <input
                        type="text"
                        value={newCatalogName}
                        onChange={(e) => setNewCatalogName(e.target.value)}
                        className="input-field"
                        placeholder="Esim. Kausi 2025"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Luo katalogi</button>
             </form>
          </div>
          
          <div className="create-chant-form" style={{ marginTop: '40px' }}>
            <form onSubmit={handleImageUpload}>
                <h3 style={{color: 'var(--primary-color)'}}>2. Lisää kuvia albumiin</h3>
                <div className="form-group">
                    <label className="form-label">Valitse albumi</label>
                    <select
                        value={uploadAlbumId}
                        onChange={(e) => setUploadAlbumId(e.target.value)}
                        className="input-field"
                        required
                    >
                        <option value="">-- Valitse albumi --</option>
                        {albums.map(album => (
                            <option key={album._id} value={album._id}>{album.title}</option>
                        ))}
                    </select>
                </div>
                 <div className="form-group">
                    <label className="form-label">Valitse kuvat (max 10)</label>
                    <input
                        type="file"
                        onChange={(e) => setFiles(e.target.files)}
                        className="input-field"
                        multiple
                        accept="image/png, image/jpeg"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Lataa kuvat</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminGallery;