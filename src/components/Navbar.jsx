// ============================================================
//  TrustID — Navbar.jsx
// ============================================================

import React, { useState } from 'react';
import { NavLink }         from 'react-router-dom';
import styles              from './Navbar.module.css';

export default function Navbar() {
  const [connecte, setConnecte] = useState(true);

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6z" fill="#0F6E56"/>
          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>TrustID</span>
      </div>

      <div className={styles.liens}>
        <NavLink to="/"            className={({ isActive }) => isActive ? styles.actif : ''}>🔍 Vérifier</NavLink>
        <NavLink to="/profil"      className={({ isActive }) => isActive ? styles.actif : ''}>👤 Profil</NavLink>
        <NavLink to="/historique"  className={({ isActive }) => isActive ? styles.actif : ''}>📋 Historique</NavLink>
        <NavLink to="/statistiques" className={({ isActive }) => isActive ? styles.actif : ''}>📊 Stats</NavLink>
      </div>

      <div className={styles.statut}>
        <div className={`${styles.dot} ${connecte ? styles.dotVert : styles.dotRouge}`} />
        <span>{connecte ? 'Connecté' : 'Hors ligne'}</span>
      </div>
    </nav>
  );
}
