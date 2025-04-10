import React from 'react';
import './Hero.css';

const Hero = ({ onScan }) => {
  return (
    <section className="hero">
      <h1>ShadowSec AI Dashboard</h1>
      <p>L’IA éthique au service de votre cybersécurité</p>
      <div className="scan-bar">
        <input type="text" placeholder="https://example.com" />
        <button onClick={onScan}>🚀 Lancer un Scan</button>
      </div>
    </section>
  );
};

export default Hero;
