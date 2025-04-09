import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "https://shadowsec-ai.onrender.com";

function Dashboard({ onLogout }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [reports, setReports] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [recommendations, setRecommendations] = useState({});

  const launchScan = async () => {
    try {
      await axios.post(`${API_URL}/scan`, { url: targetUrl });
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
        axios.get(`${API_URL}/reports`),
        axios.get(`${API_URL}/summaries`)
      ]);
      setReports(reportsRes.data);
      setSummaries(summariesRes.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  const getRecommendations = async (filename) => {
    try {
      const res = await axios.get(`${API_URL}/recommendations/${filename}`);
      setRecommendations((prev) => ({
        ...prev,
        [filename]: res.data.recommandations
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations :", error);
    }
  };

  const getSeverityLabel = (summary) => {
    const sqli = summary.some((s) => s.includes("SQLi"));
    const xss = summary.some((s) => s.includes("XSS"));
    const ports = summary.some((s) => s.includes("Ports"));

    if (sqli && xss) return <span className="label critical">🟥 Critique</span>;
    if (sqli || xss) return <span className="label high">🟧 Élevée</span>;
    if (ports) return <span className="label medium">🟨 Modérée</span>;
    return <span className="label low">🟩 Faible</span>;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>⚡ ShadowSec AI</h1>
        <button className="logout-button" onClick={onLogout}>Déconnexion</button>
      </header>

      <div className="scan-section">
        <input
          type="text"
          placeholder="http://example.com"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />
        <button className="scan-button" onClick={launchScan}>🚀 Lancer un Scan</button>
      </div>

      <section>
        <h2>📁 Rapports</h2>
        <ul>
          {reports.map((r) => (
            <li key={r.filename}>
              <a href={`${API_URL}/reports/${r.filename}`} target="_blank" rel="noreferrer">
                📄 {r.filename}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>📊 Résumés</h2>
        {summaries.map((summary) => (
          <div className="summary-card" key={summary.filename}>
            <strong>{summary.filename}</strong>
            <div>{getSeverityLabel(summary.summary)}</div>
            <ul>
              {summary.summary.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <button className="reco-button" onClick={() => getRecommendations(summary.filename)}>
              🤖 Voir recommandations IA
            </button>
            {recommendations[summary.filename] && (
              <pre className="reco-box">{recommendations[summary.filename]}</pre>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;
