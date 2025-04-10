import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Tarifs from "../components/Tarifs";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import "../LandingPage.css";

const LandingPage = () => {
  const handleScan = () => {
    alert("🚀 Fonction scan à venir !");
  };

  return (
    <div className="landing-page">
      <Navbar />
      <Hero onScan={handleScan} />
      <Tarifs />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
