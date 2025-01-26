import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackgroundImage from "../components/BackgroundImage";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      alert("Logged in successfully!");
    } catch (err: any) {
      setError(err.message);
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
    <div className="login page-content">
      <div className="login-card">
        <h3>Kirjaudu</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Sähköposti"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Salasana"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit">Kirjaudu sisään</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
    </>
  );
};

export default Login;
