import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Authentification basique
    if (username === "admin" && password === "password") {
      onLogin(); // Connexion réussie
    } else {
      alert("❌ Identifiants incorrects.");
    }
  };

  return (
    <div style={{ backgroundColor: "#111", color: "#fff", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1e1e1e",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,255,204,0.2)",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", color: "#00FFCC", textAlign: "center" }}>🔐 Connexion ShadowSec AI</h2>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.8rem",
              backgroundColor: "#222",
              border: "1px solid #555",
              borderRadius: "4px",
              color: "#fff"
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.8rem",
              backgroundColor: "#222",
              border: "1px solid #555",
              borderRadius: "4px",
              color: "#fff"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.8rem",
            backgroundColor: "#00FFC6",
            border: "none",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
