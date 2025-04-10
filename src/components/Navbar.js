import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">🛡️ ShadowSec</div>
      <button className="logout">Se déconnecter</button>
    </nav>
  );
};

export default Navbar;
