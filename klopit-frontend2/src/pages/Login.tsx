import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackgroundImage from "../components/BackgroundImage";

const Login: React.FC = () => {
  const { login, user } = useAuth();
  // Changed state to use 'username'
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pass username to the login function
      await login(formData.username, formData.password);
      navigate("/home"); 
    } catch (err: any) {
      setError(err.message || "Kirjautuminen epäonnistui. Yritä uudelleen.");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <>
      <BackgroundImage
        image=""
        description=""
        variant="default"
        title=""
      />
      <div className="container page-content">
        <div className="component-wrapper">
          <div className="login-card">
            <div className="login-card-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  {/* Updated this input field for username */}
                  <input
                    type="text"
                    placeholder="Käyttäjätunnus"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Salasana"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Kirjaudu sisään
                </button>
              </form>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;