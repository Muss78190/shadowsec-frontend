import React from 'react';
import './Tarifs.css';

const Tarifs = () => {
  return (
    <section className="tarifs">
      <h2>💼 Offre unique</h2>
      <p className="price">1099 €/mois</p>
      <ul>
        <li>✔️ Scan complet automatique</li>
        <li>✔️ IA d’analyse et recommandations</li>
        <li>✔️ Rapport professionnel PDF</li>
        <li>✔️ Tableau de bord sécurisé</li>
      </ul>
      <button>Obtenir un audit</button>
    </section>
  );
};

export default Tarifs;
