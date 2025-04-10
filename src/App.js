import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login"; // N'oublie pas d'importer Login !

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  const handleLogin = (receivedToken) => {
    setToken(receivedToken);
    localStorage.setItem("token", receivedToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <div>
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
