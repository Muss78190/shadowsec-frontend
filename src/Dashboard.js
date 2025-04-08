import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://shadowsec-ai.onrender.com";

function Dashboard({ onLogout }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [reports, setReports] = useState([]);
  const [summaries, setSummaries] = useState([]);

  const launchScan = async () => {
    try {
      await axios.post(`${BASE_URL}/scan`, { url: targetUrl });
      alert("✅ Scan lancé avec succès !");
      fetchAllData();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors du lancement du scan.");
    }
  };

  const fetchAllData = async () => {
    try {
      const [reportsRes, summariesRes] = await Promise.all([
        axios.get(`${BASE_URL}/reports`),
        axios.get(`${BASE_URL}/summaries`)
      ]);
      setReports(reportsRes.data);
      setSummaries(summariesRes.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getSeverityLabel = (summary) => {
    const sqli = summary.some((s) => s.includes("SQLi"));
    const xss = summary.some((s) => s.includes("XSS"));
    const ports = summary.some((s) => s.includes("Ports"));

    if (sqli && xss) return <span style={{ color: "red" }}>Critique</span>;
    if (sqli || xss) return <span style={{ color: "orange" }}>Élevée</span>;
    if (ports) return <span style={{ color: "#d1a000" }}>Modérée</span>;
    return <span style={{ color: "lightgreen" }}>Faible</span>;
  };

  return (
    <div style={{ padding: 30, fontFamily: "Segoe UI, sans-serif", backgroundColor: "#111", color: "#fff", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#00FFCC" }}>ShadowSec AI Dashboard</h1>
        <button
          onClick={onLogout}
          style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 4, cursor: "pointer" }}
        >
          Se déconnecter
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <input
          type="text"
          placeholder="http://example.com"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          style={{ padding: "0.6rem", width: "350px", marginRight: "10px", background: "#222", color: "#fff", border: "1px solid #555" }}
        />
        <button
          onClick={launchScan}
          style={{ padding: "0.6rem 1rem", background: "#00FFC6", border: "none", color: "#000", fontWeight: "bold", borderRadius: 5 }}
        >
          Lancer un Scan
        </button>
      </div>

      <hr style={{ margin: "30px 0", borderColor: "#333" }} />

      <h2 style={{ color: "#fff" }}>Rapports générés</h2>
      <ul>
        {reports.map((r) => (
          <li key={r.filename}>
            <a href={`${BASE_URL}/reports/${r.filename}`} target="_blank" rel="noopener noreferrer" style={{ color: "#00e0ff" }}>
              {r.filename}
            </a>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: 30, color: "#fff" }}>Résumés des rapports</h2>
      {summaries.map((summary) => (
        <div key={summary.filename} style={{ marginBottom: 25 }}>
          <strong>{summary.filename}</strong>
          <div style={{ marginTop: 5 }}>{getSeverityLabel(summary.summary)}</div>
          <ul>
            {summary.summary.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
