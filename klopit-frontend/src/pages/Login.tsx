import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackgroundImage from "../components/BackgroundImage";

const Login: React.FC = () => {
  const { login, user } = useAuth(); // Access login function and user from AuthContext
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate("/home"); // Redirect to home page after successful login
    } catch (err: any) {
      setError(err.message || "Kirjautuminen epäonnistui. Yritä uudelleen.");
    }
  };

  // Automatically redirect user if already logged in
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <>
      <BackgroundImage image="" description="" variant="default-page" />
      <div className="container page-content">
        <div className="component-wrapper">
          <div className="login-card">
            <div className="login-card-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Sähköposti"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
