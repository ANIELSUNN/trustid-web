// ============================================================
//  TrustID — Navbar.jsx
// ============================================================

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import TrustIDLogo         from './TrustIDLogo';
import styles              from './Navbar.module.css';

export default function Navbar() {
  const [connecte] = useState(true);
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => navigate(-1)}
          aria-label="Retour"
          title="Retour"
        >
          ← Retour
        </button>
        <NavLink to="/dashboard" className={styles.navBtn} title="Accueil">
          🏠 Accueil
        </NavLink>
        <div className={styles.logo}>
          <TrustIDLogo size={26} />
        </div>
      </div>

      <div className={styles.liens}>
        <NavLink to="/verifier"    className={({ isActive }) => isActive ? styles.actif : ''}>🔍 Vérifier</NavLink>
        <NavLink to="/profil"      className={({ isActive }) => isActive ? styles.actif : ''}>👤 Profil</NavLink>
        <NavLink to="/historique"  className={({ isActive }) => isActive ? styles.actif : ''}>📋 Historique</NavLink>
        <NavLink to="/statistiques" className={({ isActive }) => isActive ? styles.actif : ''}>📊 Stats</NavLink>
        <NavLink to="/upload-sign" className={({ isActive }) => isActive ? styles.actif : ''}>⬆️ Upload & signer</NavLink>
        <NavLink to="/test-mailer" className={({ isActive }) => isActive ? styles.actif : ''}>🧪 Test Gmail</NavLink>
      </div>

      <div className={styles.statut}>
        <div className={`${styles.dot} ${connecte ? styles.dotVert : styles.dotRouge}`} />
        <span>{connecte ? 'Connecté' : 'Hors ligne'}</span>
      </div>
    </nav>
  );
}
